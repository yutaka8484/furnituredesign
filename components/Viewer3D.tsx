import React, { forwardRef, useImperativeHandle, useRef, useState, Suspense } from 'react';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Plane, Html } from '@react-three/drei';
import { useConfigStore } from '../store/useConfigStore';
import { FINISH_MATERIALS } from './materials';
import type { ARExporterHandle, Specification } from '../types';
import CellEditor from './CellEditor';

const getThickness = (thickness: Specification['boardThickness']) => {
    return parseInt(thickness.replace('t', ''), 10);
};

// Component to handle exporting the scene to GLB
const Exporter = forwardRef((props, ref) => {
    const { scene } = useThree();
    useImperativeHandle(ref, () => ({
        exportScene: () => {
            return new Promise<Blob>((resolve, reject) => {
                const exporter = new GLTFExporter();
                // We need to clone the scene to avoid modifying the original
                const sceneToExport = scene.clone();
                
                // Find and remove helper elements (like Html) that can't be exported
                sceneToExport.traverse((object) => {
                    if (object.userData.isHtml) { // A conventional way to tag components
                        object.visible = false;
                    }
                });

                exporter.parse(
                    sceneToExport,
                    (result) => {
                        if (result instanceof ArrayBuffer) {
                            resolve(new Blob([result], { type: 'model/gltf-binary' }));
                        } else {
                            const output = JSON.stringify(result, null, 2);
                            resolve(new Blob([output], { type: 'application/json' }));
                        }
                    },
                    // FIX: Explicitly type the error parameter to avoid potential TypeScript inference issues.
                    (error: any) => {
                        console.error('An error happened during GLTF export', error);
                        reject(error);
                    },
                    { binary: true, embedImages: true }
                );
            });
        }
    }));
    return null;
});


const CabinetModel: React.FC = () => {
    const spec = useConfigStore(state => state.spec);
    const [activeCell, setActiveCell] = useState<{row: number, col: number} | null>(null);

    const { width, height, depth, finish, boardThickness, backPanel, columnRatios, rowRatios, cells } = spec;
    const t = getThickness(boardThickness);

    const material = FINISH_MATERIALS[finish];

    // Convert mm to meters for three.js
    const scale = 0.001;
    const w = width * scale;
    const h = height * scale;
    const d = depth * scale;
    const th = t * scale;

    const totalColRatio = columnRatios.reduce((a, b) => a + b, 0) || 1;
    const totalRowRatio = rowRatios.reduce((a, b) => a + b, 0) || 1;

    const internalWidth = w - 2 * th;
    const internalHeight = h - 2 * th;

    const colWidths = columnRatios.map(r => (r / totalColRatio) * (internalWidth - (columnRatios.length - 1) * th));
    const rowHeights = rowRatios.map(r => (r / totalRowRatio) * (internalHeight - (rowRatios.length - 1) * th));

    let currentX = -internalWidth / 2;
    const colX = colWidths.map(cw => {
        const x = currentX + cw / 2;
        currentX += cw + th;
        return x;
    });

    let currentY = internalHeight / 2;
    const rowY = rowHeights.map(rh => {
        const y = currentY - rh / 2;
        currentY -= rh + th;
        return y;
    });

    const handleCellClick = (e: any, row: number, col: number) => {
        e.stopPropagation(); // Prevent OrbitControls from moving camera
        setActiveCell({row, col});
    };
    
    const handleCloseEditor = () => {
        setActiveCell(null);
    }

    return (
        // FIX: The onClick handler is now more explicit to prevent ambiguity and stop event propagation, which could cause the "Expected 1 arguments, but got 0" error.
        <group position={[0, h / 2, 0]} onClick={(e) => { e.stopPropagation(); setActiveCell(null); }}>
            {/* Main Box Panels */}
            <Box args={[w, th, d]} position={[0, h - th / 2, 0]} material={material} castShadow receiveShadow /> {/* Top */}
            <Box args={[w, th, d]} position={[0, 0 + th / 2, 0]} material={material} castShadow receiveShadow /> {/* Bottom */}
            <Box args={[th, h, d]} position={[-w / 2 + th / 2, h / 2, 0]} material={material} castShadow receiveShadow /> {/* Left */}
            <Box args={[th, h, d]} position={[w / 2 - th / 2, h / 2, 0]} material={material} castShadow receiveShadow /> {/* Right */}
            {backPanel === 'on' && <Box args={[w, h, th]} position={[0, h / 2, -d/2 + th/2]} material={material} castShadow receiveShadow />}

            {/* Internal Dividers */}
            {columnRatios.length > 1 && Array.from({ length: columnRatios.length - 1 }).map((_, i) => {
                const xPos = -internalWidth/2 + colWidths.slice(0, i + 1).reduce((a,b) => a+b, 0) + (i + 0.5) * th;
                return <Box key={`v-div-${i}`} args={[th, internalHeight, d]} position={[xPos, h/2, 0]} material={material} castShadow receiveShadow />;
            })}
            {rowRatios.length > 1 && Array.from({ length: rowRatios.length - 1 }).map((_, i) => {
                const yPos = internalHeight/2 - rowHeights.slice(0, i + 1).reduce((a,b) => a+b, 0) - (i + 0.5) * th;
                return <Box key={`h-div-${i}`} args={[internalWidth, th, d]} position={[0, yPos + h/2, 0]} material={material} castShadow receiveShadow />;
            })}

            {/* Cells and interaction planes */}
            {cells.map((row, r) => row.map((cell, c) => {
                const cellW = colWidths[c];
                const cellH = rowHeights[r];
                const cellX = colX[c];
                const cellY = rowY[r];
                if(isNaN(cellW) || isNaN(cellH) || isNaN(cellX) || isNaN(cellY)) return null;

                return (
                    <group key={`cell-${r}-${c}`} position={[cellX, cellY, 0]}>
                        <Plane
                            args={[cellW, cellH]}
                            position={[0, 0, d/2 - th]}
                            onClick={(e) => handleCellClick(e, r, c)}
                            visible={false}
                        />
                         {cell.type === 'door' && <Box args={[cellW - th*0.1, cellH - th*0.1, th]} position={[0, 0, d/2 - th*1.5]} material={material} castShadow receiveShadow />}
                         {cell.type === 'drawer' && 
                            <Box args={[cellW - th*0.1, cellH - th*0.1, th]} position={[0, 0, d/2 - th*1.5]} material={material} castShadow receiveShadow>
                                {/* FIX: Removed redundant rotation prop and confusing user comment. */}
                                <Plane args={[cellW*0.5, th*0.5]} position={[0, 0, th/2 + 0.001]}>
                                    <meshStandardMaterial color="#888" roughness={0.3} metalness={0.8} />
                                </Plane>
                            </Box>
                         }
                        {activeCell?.row === r && activeCell?.col === c && (
                            <Html center position={[0, 0, d/2]} userData={{ isHtml: true }}>
                                <CellEditor row={r} col={c} onClose={handleCloseEditor} />
                            </Html>
                        )}
                    </group>
                );
            }))}

        </group>
    );
}

const Viewer3D = forwardRef<ARExporterHandle, {}>((props, ref) => {
    const exporterRef = useRef<any>();
    
    useImperativeHandle(ref, () => ({
        exportToGLB: async () => {
            if (exporterRef.current) {
                return exporterRef.current.exportScene();
            }
            throw new Error("Exporter not ready");
        },
    }));

    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [1, 1.5, 2.5], fov: 50 }}
                shadows
                gl={{ preserveDrawingBuffer: true }} // required for exporter
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={1.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={100} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={50} />
                    
                    <CabinetModel />
                    
                    <Exporter ref={exporterRef} />
                    
                    <OrbitControls makeDefault />
                </Suspense>
            </Canvas>
        </div>
    );
});

export default Viewer3D;
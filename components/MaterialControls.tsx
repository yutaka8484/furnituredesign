import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { ConfigSection, ControlWrapper, OptionGroup, ColorSwatchGroup } from './ConfigShared';
import type { Finish, BoardThickness } from '../types';
import { FINISH_MATERIALS } from './materials';

const MaterialControls: React.FC = () => {
    const spec = useConfigStore(state => state.spec);
    const updateSpec = useConfigStore(state => state.updateSpec);
    const { availableOptions } = useConfigStore(state => state.settings);

    return (
        <ConfigSection title="素材と仕上げ">
            <ControlWrapper label="仕上げ">
                <ColorSwatchGroup
                    options={availableOptions.finishes}
                    selectedValue={spec.finish}
                    onChange={(finish) => updateSpec({ finish: finish as Finish })}
                    materialMap={FINISH_MATERIALS}
                />
            </ControlWrapper>
            <ControlWrapper label="板厚">
                <OptionGroup
                    options={availableOptions.boardThicknesses}
                    selectedValue={spec.boardThickness}
                    onChange={(boardThickness) => updateSpec({ boardThickness: boardThickness as BoardThickness })}
                />
            </ControlWrapper>
        </ConfigSection>
    );
};

export default MaterialControls;
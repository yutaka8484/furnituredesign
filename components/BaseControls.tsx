import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { ConfigSection, ControlWrapper, OptionGroup } from './ConfigShared';
import type { BackPanel, BaseType } from '../types';

const BaseControls: React.FC = () => {
    const spec = useConfigStore(state => state.spec);
    const updateSpec = useConfigStore(state => state.updateSpec);
    const { availableOptions } = useConfigStore(state => state.settings);

    return (
        <ConfigSection title="ベースと背板">
            <ControlWrapper label="ベース">
                <OptionGroup
                    options={availableOptions.bases}
                    selectedValue={spec.base}
                    onChange={(base) => updateSpec({ base: base as BaseType })}
                />
            </ControlWrapper>
             <ControlWrapper label="背板">
                <OptionGroup
                    options={availableOptions.backPanels}
                    selectedValue={spec.backPanel}
                    onChange={(backPanel) => updateSpec({ backPanel: backPanel as BackPanel })}
                />
            </ControlWrapper>
        </ConfigSection>
    );
};

export default BaseControls;
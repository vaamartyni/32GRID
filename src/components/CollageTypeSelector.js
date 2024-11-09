import React from 'react';
import styled from 'styled-components';

const CollageTypeSelectorWrapper = styled.select`
    margin: 10px 0;
    padding: 5px;
    font-size: 16px;
`;

const CollageTypeSelector = ({ onChange }) => (
    <CollageTypeSelectorWrapper onChange={onChange}>
        <option value="two-rows-ten-elements">Two Rows with 10 Elements</option>
        <option value="two-rows-twelve-elements">Two Rows with 12 Elements</option>
    </CollageTypeSelectorWrapper>
);

export default CollageTypeSelector;

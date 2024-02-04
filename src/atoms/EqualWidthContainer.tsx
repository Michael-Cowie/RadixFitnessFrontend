import styled from 'styled-components';

/**
 * The purpose of this container is to hold a series of elements which all contain
 * the css property, `width: 100%`. This element will become the width of the widest
 * element and all other elements will expand to the width due to `width: 100%`. This
 * element will create a consistent width when this is done repeatadly throughout
 * the codebase.
*/

const EqualWidthContainer = styled.div`
    width: 15%;
    min-width: 200px;
    max-width: 300px;
`

export default EqualWidthContainer;
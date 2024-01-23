import React from 'react';
import styled from 'styled-components';

const LeftBoxContent = () => {
  const LeftBoxCont = styled.div`
    position: absolute;    
    width: 50%; /* Set the width to 100% */
  `;

  return (
    <div>
      <LeftBoxCont>
        <p>Github files go here test test test test</p>
      </LeftBoxCont>

      {/* Add any additional content for the LeftBox */}
    </div>
  );
};

export default LeftBoxContent;

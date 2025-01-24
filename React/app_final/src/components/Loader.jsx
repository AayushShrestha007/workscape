// src/components/Loader.js
import React from 'react';
import { Oval } from 'react-loader-spinner';
import styled from 'styled-components';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
`;

const Loader = () => {
    return (
        <LoaderContainer>
            <Oval
                height={80}
                width={80}
                color="#2d69b3"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#65A168"
                strokeWidth={2}
                strokeWidthSecondary={2}
            />
        </LoaderContainer>
    );
};

export default Loader;

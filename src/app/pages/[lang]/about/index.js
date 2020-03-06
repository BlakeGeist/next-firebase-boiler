import React from "react";
import Layout from "../../../layouts/Layout";
import styled from 'styled-components';

const About = () => {
  return (
    <Layout pageMod="about">
      <h1>About page</h1>
      <Title>About page content</Title>
      <p>Yellow</p>
    </Layout>
  );
};

const Title = styled.h1`
  color: red;
`;

export default About;

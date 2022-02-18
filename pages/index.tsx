import Head from "next/head"
import { GetStaticProps } from "next"
import styled from "@emotion/styled"
import type { Theme } from 'theme-ui'
import { theme } from "src/logic/styles"

export default function Home(){
  return (
    <Container>
      <H2>Home</H2>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async()=>{
  return {
    props: {}
  }
}
const Container = styled.div`
width: 100vw;
max-width: 60rem;
align-items: center;
`

const H2 = styled.h2<{ theme: Theme }>`
text-align: center;
text-decoration: underline ${({ theme }) => theme.colors.primary };
`
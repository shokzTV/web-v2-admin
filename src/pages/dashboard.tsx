import React, { ReactElement } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
const { Header } = Layout;

export default function Dashboard(): ReactElement {
  return <Layout className="layout" style={{ height: '100vh' }}>
    <Head>
      <title>Dashboard</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Header  style={{ height: '46px' }}><PageMenu /></Header>
  </Layout>;
}

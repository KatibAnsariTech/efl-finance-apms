import React from "react";
import { Helmet } from 'react-helmet-async';
import ApplicationsDashboard from '../components/ApplicationsDashboard';

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <ApplicationsDashboard />
    </>
  );
}

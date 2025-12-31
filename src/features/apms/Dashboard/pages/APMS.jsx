import React from 'react'
import { Helmet } from 'react-helmet-async'
import APMSDashboard from '../components/APMSDashboard'

const APMS = () => {
    return (
        <>
            <Helmet>
                <title>APMS</title>
            </Helmet>
            <APMSDashboard />
        </>
    )
}

export default APMS

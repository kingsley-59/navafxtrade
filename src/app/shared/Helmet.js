import React from 'react';
import { Helmet } from 'react-helmet';

const HelmetConfig = ({title, description, keywords}) => {
  return (
    <>
        <Helmet>
            <meta name='description' content={description ?? ''} />
            <meta name='keywords' comtent={keywords?.join(',') ?? ''} />
            <title>{ title }</title>
        </Helmet>
    </>
  )
}

export default HelmetConfig
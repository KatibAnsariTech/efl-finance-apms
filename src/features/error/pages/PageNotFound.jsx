import { Helmet } from 'react-helmet-async';
import { NotFoundView } from 'src/sections/error';

export default function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
      </Helmet>
      <NotFoundView />
    </>
  );
}

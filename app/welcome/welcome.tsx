import { Suspense, lazy } from 'react';
import { Spinner } from 'react-bootstrap';

const CrimeMap = lazy(() => import("../map/map"));

export function Welcome() {
  return (
    <main className="p-4 vh-100">
      <div className="d-flex flex-column h-100 gx-4">
        <div>
          <h1>Crime Stats SA</h1>
        </div>
        <div className="flex-grow-1 d-flex flex-row w-100">
          <div className="flex-grow-1 h-100" style={{ width: '65%' }}>
            <Suspense fallback={<Spinner animation="border" role="status" />}>
              <CrimeMap />
            </Suspense>
          </div>
          <div className="flex-grow-1" style={{ width: '35%' }}></div>
        </div>
      </div>
    </main>
  );
}
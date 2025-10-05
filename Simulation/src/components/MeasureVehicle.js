// src/components/MeasureVehicle.js

import React, { Suspense } from 'react';

import { Tractor } from './models/Satellite';
import { Missile } from './models/NuclearMissile';
import { Starship } from './models/Starship';

const MeasureVehicle = React.forwardRef(({ type }, ref) => {
  const renderVehicle = () => {
    switch (type) {
      case 'missile':
        return <Missile scale={1} />; // A default scale for the missile
      case 'tractor':
        return <Tractor scale={0.01} />; // A default scale for the satellite
      
      // --- THIS IS THE FIX FOR THE SIZE ---
      case 'starship':
        // Apply a much smaller, specific scale just for the starship model
        return <Starship scale={0.0001} />;
      // ------------------------------------

      default:
        return null;
    }
  };

  return (
    // We remove the scale from the parent group so each model can have its own specific scale
    <group ref={ref}>
      <Suspense fallback={null}>
        {renderVehicle()}
      </Suspense>
    </group>
  );
});

export default MeasureVehicle;
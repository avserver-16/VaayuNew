import React, { Suspense, useRef, useState, useMemo ,useEffect} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html,Text } from '@react-three/drei';
import { GridHelper, BufferGeometry, Float32BufferAttribute } from 'three';
import * as THREE from 'three';
import './AirportScene.css';

const AirportModel = () => {
  
  const modelRef = useRef();
  const { scene } = useGLTF('/models/airport.glb');
  return <primitive ref={modelRef} object={scene} scale={2} position={[15, 0, 0]} />;
};

const TerminalMarker = ({ position, name, isSelected, onClick }) => {
  return (
    <mesh
      position={position}
      onClick={onClick}
      scale={isSelected ? 1.5 : 1}
      castShadow
    >
      <sphereGeometry args={[0.3, 25, 32]} />
      <meshStandardMaterial color={isSelected ? 'red' : 'blue'} />
      <Html distanceFactor={10} position={[0, 1.5, 0]}>
        <div style={{ color: isSelected ? 'orange' : 'white', fontWeight: 'bold', textAlign: 'center' }}>
          {name}
        </div>
      </Html>
    </mesh>
  );
};

const ConnectionLine = ({ points }) => {
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const vertices = [];
    points.forEach((p) => vertices.push(...p));
    geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    return geo;
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial attach="material" color="red" linewidth={2} />
    </line>
  );
};


const AirportScene = () => {
  const [route, setRoute] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
const [showRules, setShowRules] = useState(true);
const [name,setName]=useState('')

  const terminals = [
    { id: 1, name: 'Entrance', position: [20, 0, 0] },
    { id: 2, name: 'Gate A', position: [0, 1, -1.8] },
    { id: 3, name: 'Gate B', position: [0, 1, 2] },
    { id: 4, name: 'Security-19A', position: [10, 0, 0.2] },
    { id: 5, name: 'Security-23H', position: [10, 0, -2.8] },
    { id: 6, name: 'Security-92M', position: [10, 0, 4] },
    { id: 7, name: 'Security-98G', position: [10, 0, 3] },
    { id: 9, name: 'Security-54J', position: [10, 0, -1.8] },
    { id: 10, name: 'Security-89Q', position: [10, 0, -0.8] },
    { id: 11, name: 'Food Court', position: [5, 0, -4] },
    { id: 12, name: 'Vajra Lounge', position: [0, 1, -6] },
    { id: 13, name: 'Gaja Lounge', position: [3, 1, -6] },
  ];
  
 
  const handleTerminalClick = (terminal) => {
    // Disallow adding two terminals of the same section
    const sameSectionExists = route.some((t) => t.name.split('-')[0] === terminal.name.split('-')[0]);
    if (route.find(t => t.id === terminal.id) || sameSectionExists) return;

    setRoute((prev) => [...prev, terminal]);
  };

  const clearRoute = () => setRoute([]);

  const connectionPoints = route.map(t => t.position);
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};
  return (
    <>
    {showRules && (
  <div className="modal-overlay">
    <div className="modal-card">
      <h1>Vaayu Margam, Welcomes you</h1>
      <h2>Navigation Rules</h2>
      <ul>
        <li>Click on ☰ and desired terminals to add them to your route.</li>
        <li>Do not add two terminals from the same section.</li>
        <li>Use the back arrow to close the sidebar menu on mobile.</li>
        <li>Click “Clear Route” to reset your navigation.</li>
      </ul>
      <button onClick={() => setShowRules(false)} className="close-button">Got it!</button>
    </div>
  </div>
)}
<div className={showRules ? "blurred" : ""}>
  {/* your entire page content here: nav, canvas, etc. */}

<div className='title'>
 <div className='p'>Airport</div>Navigation
</div>
<button className="top-right-button" onClick={() => setShowRules(prev => !prev)}>
  <div>Help?</div>
</button>


     <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
  ☰
</button>

<nav className={`navbar modern-navbar ${menuOpen ? '' : 'closed'}`}>
<button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
  ☰
</button>

        <div className="section-group">
          <h3>Entrance</h3>
          {terminals.filter(t => t.name.includes('Entrance')).map((term) => (
            <button
              key={term.id}
              onClick={() => handleTerminalClick(term)}
              className={`terminal-button ${route.find(r => r.id === term.id) ? 'selected' : ''}`}
            >
              {term.name}
            </button>
          ))}
        </div>

        <div className="section-group">
          <h3>Security</h3>
          {terminals.filter(t => t.name.includes('Security')).map((term) => (
            <button
              key={term.id}
              onClick={() => handleTerminalClick(term)}
              className={`terminal-button ${route.find(r => r.id === term.id) ? 'selected' : ''}`}
            >
              {term.name}
            </button>
          ))}
        </div>

        <div className="section-group">
          <h3>Gates</h3>
          {terminals.filter(t => t.name.includes('Gate')).map((term) => (
            <button
              key={term.id}
              onClick={() => handleTerminalClick(term)}
              className={`terminal-button ${route.find(r => r.id === term.id) ? 'selected' : ''}`}
            >
              {term.name}
            </button>
          ))}
        </div>

        <div className="section-group">
          <h3>Lounges</h3>
          {terminals.filter(t => t.name.includes('Lounge')).map((term) => (
            <button
              key={term.id}
              onClick={() => handleTerminalClick(term)}
              className={`terminal-button ${route.find(r => r.id === term.id) ? 'selected' : ''}`}
            >
              {term.name}
            </button>
          ))}
        </div>

        <div className="section-group">
          <h3>Food Court</h3>
          {terminals.filter(t => t.name.includes('Food')).map((term) => (
            <button
              key={term.id}
              onClick={() => handleTerminalClick(term)}
              className={`terminal-button ${route.find(r => r.id === term.id) ? 'selected' : ''}`}
            >
              {term.name}
            </button>
          ))}
        </div>

        <div className="info-panel">
          {route.length > 0 ? (
            <>
              <h4>Route:</h4>
              <p className="route">
                {route.map((t, i) => (
                  <span key={t.id}>
                    {t.name}
                    {i !== route.length - 1 && ' ➔ '}
                  </span>
                ))}
              </p>
              <button className="close" onClick={clearRoute}>Clear Route</button>
            </>
          ) : (
            <p>Select terminals to build a route</p>
          )}
        </div>
      </nav>

      <div className="canvas-container">
        <Canvas
          camera={{ position: [0, 20, 50], fov: 29 }}
          style={{ background: '#000' }}
          shadows
        >
    <Text
  font='/Doto/static/Doto_Rounded-Light.ttf'
  fontSize={2}
  color="white"
  position={[2, 8, 0]}
>
 Vaayu Margam
</Text>
          <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={0.6} />
          <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
          <spotLight position={[0, 50, 50]} angle={0.3} intensity={0.5} penumbra={1} castShadow />

          <Suspense fallback={null}>
            <AirportModel />
            {terminals.map((term) => (
              <TerminalMarker
                key={term.id}
                position={term.position}
                name={term.name}
                isSelected={route.find(r => r.id === term.id)}
                onClick={() => handleTerminalClick(term)}
              />
            ))}
            {connectionPoints.length > 1 && <ConnectionLine points={connectionPoints} />}
            <Environment preset="city" />
          </Suspense>

          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>
      </div>
    </>
  );
};

export default AirportScene;

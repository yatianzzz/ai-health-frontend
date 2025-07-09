import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface Panda3DProps {
  width?: number;
  height?: number;
}

const Panda3D: React.FC<Panda3DProps> = ({
  width = 400,
  height = 450
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const modelRef = useRef<THREE.Group>();
  const animationIdRef = useRef<number>();
  const mixerRef = useRef<THREE.AnimationMixer>();
  const [isLoading, setIsLoading] = useState(true);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [showClickBubble, setShowClickBubble] = useState(false);
  const [isClickAnimating, setIsClickAnimating] = useState(false);
  const clickAnimationRef = useRef<number>(0);

  // 拖拽相关状态
  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const initialMousePositionRef = useRef({ x: 0, y: 0 });
  const modelRotationRef = useRef({ x: 0, y: -Math.PI / 2 });
  const mouseHandlersRef = useRef<{
    onMouseDown?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
  }>({});

  


  
  const handleChickClick = () => {
    setShowSpeechBubble(false);

    setShowClickBubble(true);
    setIsClickAnimating(true);
    clickAnimationRef.current = 0;

    setTimeout(() => {
      setShowClickBubble(false);
      setIsClickAnimating(false);
    }, 2000);
  };

 
  useEffect(() => {
    const handleMessageSent = () => {
      setShowSpeechBubble(false);
    };


    window.addEventListener('messageSent', handleMessageSent);

    return () => {
      window.removeEventListener('messageSent', handleMessageSent);
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfbdde7); 
    sceneRef.current = scene;

    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 4.5);
    camera.lookAt(0, -0.3, 0);
    cameraRef.current = camera;

    
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false, 
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0xc8c3e0, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    
    const loader = new GLTFLoader();
    loader.load(
      '/chick/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;


        model.scale.setScalar(1.2);
        model.position.set(0, -0.8, 0);
        model.rotation.y = -Math.PI / 2;

        // 直接显示说话框，不需要等待旋转完成
        setTimeout(() => {
          setShowSpeechBubble(true);
        }, 500);

       
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

           
            if (child.material) {
              child.material.needsUpdate = true;
            }
          }
        });

        scene.add(model);
        setIsLoading(false);

        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouseHandlersRef.current.onMouseDown = (event: MouseEvent) => {
          if (!mountRef.current || !cameraRef.current) return;

          const rect = mountRef.current.getBoundingClientRect();
          mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

          raycaster.setFromCamera(mouse, cameraRef.current);
          const intersects = raycaster.intersectObject(model, true);

          if (intersects.length > 0) {
            isDraggingRef.current = true;
            initialMousePositionRef.current = { x: event.clientX, y: event.clientY };
            lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
            event.preventDefault();
          }
        };

        mouseHandlersRef.current.onMouseMove = (event: MouseEvent) => {
          if (!isDraggingRef.current || isClickAnimating) return;

          const deltaX = event.clientX - lastMousePositionRef.current.x;
          const deltaY = event.clientY - lastMousePositionRef.current.y;

          const prev = modelRotationRef.current;
          modelRotationRef.current = {
            x: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, prev.x + deltaY * 0.01)),
            y: prev.y + deltaX * 0.01
          };

          lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
        };

        mouseHandlersRef.current.onMouseUp = (event: MouseEvent) => {
          if (isDraggingRef.current) {
            // 计算从初始位置到释放位置的总距离
            const deltaX = Math.abs(event.clientX - initialMousePositionRef.current.x);
            const deltaY = Math.abs(event.clientY - initialMousePositionRef.current.y);
            const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // 如果鼠标移动距离很小，认为是点击
            if (totalDistance < 10) {
              handleChickClick();
            }
          }
          isDraggingRef.current = false;
        };

        if (mountRef.current) {
          mountRef.current.addEventListener('mousedown', mouseHandlersRef.current.onMouseDown);
          // 将 mousemove 和 mouseup 事件添加到 document 上，这样即使鼠标移出容器也能继续拖拽
          document.addEventListener('mousemove', mouseHandlersRef.current.onMouseMove);
          document.addEventListener('mouseup', mouseHandlersRef.current.onMouseUp);
        }

        // 暂时移除动画，保持模型静止
      },
      () => {
        // Loading progress
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // 渲染循环（无动画）
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (modelRef.current) {
        if (!isClickAnimating) {
          // 应用拖拽旋转
          modelRef.current.rotation.x = modelRotationRef.current.x;
          modelRef.current.rotation.y = modelRotationRef.current.y;
        }

        if (isClickAnimating) {
          clickAnimationRef.current += 0.15;
          const bounce = Math.sin(clickAnimationRef.current * 2) * 0.3;
          const wiggle = Math.sin(clickAnimationRef.current * 8) * 0.2;
          const scale = 1.2 + Math.sin(clickAnimationRef.current * 4) * 0.15;

          modelRef.current.position.y = -0.8 + Math.abs(bounce);
          modelRef.current.rotation.z = wiggle;
          modelRef.current.scale.setScalar(scale);

          if (clickAnimationRef.current >= Math.PI * 3) {
            setIsClickAnimating(false);
            modelRef.current.position.y = -0.8;
            modelRef.current.rotation.z = 0;
            modelRef.current.scale.setScalar(1.2);
            clickAnimationRef.current = 0;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 清理函数
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
      if (mountRef.current) {
        // 移除事件监听器
        if (mouseHandlersRef.current.onMouseDown) {
          mountRef.current.removeEventListener('mousedown', mouseHandlersRef.current.onMouseDown);
          document.removeEventListener('mousemove', mouseHandlersRef.current.onMouseMove!);
          document.removeEventListener('mouseup', mouseHandlersRef.current.onMouseUp!);
        }

        if (renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          try {
            mountRef.current.removeChild(renderer.domElement);
          } catch (error) {
            console.warn('Failed to remove renderer DOM element:', error);
          }
        }
      }
      renderer.dispose();
    };
  }, [width, height]);

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          margin: '0 auto',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          Loading 3D Model...
        </div>
      )}

      {/* 说话框 */}
      {showSpeechBubble && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'white',
            padding: '12px 16px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '14px',
            color: '#333',
            maxWidth: '200px',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.4',
            border: '2px solid #c8c3e0',
            animation: 'fadeInUp 0.5s ease-out'
          }}
        >
          Hi! I'm Nikky. How are you feeling today?
          {}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '30px',
              width: '0',
              height: '0',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid white'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '28px',
              width: '0',
              height: '0',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #c8c3e0'
            }}
          />
        </div>
      )}

      {showClickBubble && !showSpeechBubble && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: 'white',
            padding: '12px 16px',
            borderRadius: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '14px',
            color: '#333',
            maxWidth: '200px',
            fontFamily: 'Arial, sans-serif',
            lineHeight: '1.4',
            border: '2px solid #c8c3e0',
            animation: 'fadeInUp 0.5s ease-out'
          }}
        >
          waves wing~ Hello friend!
          {/* 说话框尾巴 */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '30px',
              width: '0',
              height: '0',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid white'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              right: '28px',
              width: '0',
              height: '0',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid #c8c3e0'
            }}
          />
        </div>
      )}
    </div>
    </>
  );
};

export default Panda3D;

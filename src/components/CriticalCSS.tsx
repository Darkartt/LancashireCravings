import React from 'react';

const CriticalCSS: React.FC = () => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Critical CSS for above-the-fold content */
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
          }
          
          /* Hero section critical styles */
          .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            position: relative;
            overflow: hidden;
          }
          
          .hero-content {
            text-align: center;
            max-width: 800px;
            padding: 2rem;
            z-index: 2;
          }
          
          .hero h1 {
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 700;
            margin-bottom: 1rem;
            color: #2c3e50;
            line-height: 1.2;
          }
          
          .hero p {
            font-size: clamp(1.1rem, 2vw, 1.5rem);
            margin-bottom: 2rem;
            color: #34495e;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          /* Navigation critical styles */
          .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            padding: 1rem 0;
            transition: all 0.3s ease;
          }
          
          .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          /* Button critical styles */
          .btn {
            display: inline-block;
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1rem;
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
          }
          
          /* Loading states */
          .loading {
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .loaded {
            opacity: 1;
          }
          
          /* Responsive critical styles */
          @media (max-width: 768px) {
            .hero-content {
              padding: 1rem;
            }
            
            .nav-content {
              padding: 0 1rem;
            }
          }
        `
      }}
    />
  );
};

export default CriticalCSS;

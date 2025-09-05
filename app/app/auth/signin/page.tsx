
'use client';

export default function SignInPage() {
  
  const handleLogin = (userEmail: string, userData: any) => {
    try {
      console.log('Logging in user:', userEmail);
      localStorage.setItem('birdlogyc_session', JSON.stringify({
        user: userData,
        expires: Date.now() + (24 * 60 * 60 * 1000)
      }));
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      alert('Erreur de connexion');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#eff6ff',
      padding: '16px'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        padding: '24px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            birdlogyc
          </h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Mode Démonstration</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
            Choisir un profil:
          </h3>
          
          <button
            onClick={() => handleLogin('pierre@birdlogyc.com', {
              id: 'cmevym6140001pzulv86ez0zx',
              email: 'pierre@birdlogyc.com',
              name: 'Pierre Martin',
              firstName: 'Pierre',
              lastName: 'Martin',
              role: 'MANAGER',
              territory: 'Suisse Romande'
            })}
            style={{
              width: '100%',
              padding: '16px',
              textAlign: 'left',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              marginBottom: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <div style={{ fontWeight: '500', color: '#111827' }}>Pierre Martin</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>pierre@birdlogyc.com</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Manager - Suisse Romande</div>
          </button>

          <button
            onClick={() => handleLogin('manager@birdlogyc.com', {
              id: 'cmevym6120000pzultnfb7d49',
              email: 'manager@birdlogyc.com',
              name: 'Sarah Johnson',
              firstName: 'Sarah',
              lastName: 'Johnson',
              role: 'MANAGER',
              territory: 'Suisse Romande'
            })}
            style={{
              width: '100%',
              padding: '16px',
              textAlign: 'left',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              marginBottom: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <div style={{ fontWeight: '500', color: '#111827' }}>Sarah Johnson</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>manager@birdlogyc.com</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Manager - Suisse Romande</div>
          </button>

          <button
            onClick={() => handleLogin('marie@birdlogyc.com', {
              id: 'cmevym6160002pzulln8nonnp',
              email: 'marie@birdlogyc.com',
              name: 'Marie Dubois',
              firstName: 'Marie',
              lastName: 'Dubois',
              role: 'SALES_REP',
              territory: 'Lausanne'
            })}
            style={{
              width: '100%',
              padding: '16px',
              textAlign: 'left',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              marginBottom: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <div style={{ fontWeight: '500', color: '#111827' }}>Marie Dubois</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>marie@birdlogyc.com</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Commercial - Lausanne</div>
          </button>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/" style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none' }}>
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

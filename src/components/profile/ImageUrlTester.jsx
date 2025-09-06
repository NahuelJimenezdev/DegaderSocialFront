// Componente para probar diferentes URLs de imagen
import { useState } from "react";

export function ImageUrlTester({ currentImageUrl }) {
  const [testUrls, setTestUrls] = useState([]);
  const [customUrl, setCustomUrl] = useState("");

  // Generar URLs de prueba basadas en la URL actual
  const generateTestUrls = () => {
    if (!currentImageUrl) return;

    const baseUrl = currentImageUrl.split('/').slice(0, -1).join('/');
    const fileName = currentImageUrl.split('/').pop();

    const urls = [
      currentImageUrl,
      `${baseUrl}/${fileName}`,
      `http://localhost:3001${currentImageUrl}`,
      `http://localhost:3001/uploads/${fileName}`,
      `http://localhost:3001/static/${fileName}`,
      `http://localhost:3001/images/${fileName}`,
      `http://localhost:3001/assets/${fileName}`,
      `http://localhost:3001/public/${fileName}`,
    ];

    setTestUrls(urls);
  };

  const testImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ success: true, url, width: img.width, height: img.height });
      img.onerror = () => resolve({ success: false, url });
      img.src = url;
    });
  };

  const testAllUrls = async () => {
    const results = await Promise.all(testUrls.map(testImage));
    setTestUrls(results.map(result => ({ ...result, tested: true })));
  };

  const addCustomUrl = () => {
    if (customUrl && !testUrls.find(u => u.url === customUrl)) {
      setTestUrls([...testUrls, { url: customUrl, custom: true }]);
      setCustomUrl("");
    }
  };

  return (
    <div className="card p-4 mb-3">
      <h5>🧪 Probador de URLs de Imagen</h5>

      <div className="mb-3">
        <button
          className="btn btn-primary me-2"
          onClick={generateTestUrls}
          disabled={!currentImageUrl}
        >
          🔍 Generar URLs de Prueba
        </button>

        <button
          className="btn btn-success me-2"
          onClick={testAllUrls}
          disabled={testUrls.length === 0}
        >
          ✅ Probar Todas las URLs
        </button>
      </div>

      <div className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Agregar URL personalizada para probar"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomUrl()}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={addCustomUrl}
            disabled={!customUrl}
          >
            Agregar
          </button>
        </div>
      </div>

      {testUrls.length > 0 && (
        <div>
          <h6>URLs a Probar:</h6>
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Estado</th>
                  <th>Dimensiones</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {testUrls.map((urlInfo, index) => (
                  <tr key={index}>
                    <td>
                      <code className="text-break">{urlInfo.url}</code>
                      {urlInfo.custom && <span className="badge bg-info ms-2">Personalizada</span>}
                    </td>
                    <td>
                      {urlInfo.tested ? (
                        urlInfo.success ? (
                          <span className="badge bg-success">✅ Funciona</span>
                        ) : (
                          <span className="badge bg-danger">❌ Falló</span>
                        )
                      ) : (
                        <span className="badge bg-secondary">⏳ Sin probar</span>
                      )}
                    </td>
                    <td>
                      {urlInfo.tested && urlInfo.success ? (
                        `${urlInfo.width} × ${urlInfo.height}`
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => window.open(urlInfo.url, '_blank')}
                        >
                          🔗
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => navigator.clipboard.writeText(urlInfo.url)}
                        >
                          📋
                        </button>
                        {urlInfo.tested && urlInfo.success && (
                          <button
                            className="btn btn-outline-success"
                            onClick={() => {
                              // Aquí podrías actualizar la imagen del usuario
                              alert(`Esta URL funciona: ${urlInfo.url}`);
                            }}
                          >
                            ✅ Usar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentImageUrl && (
        <div className="mt-3">
          <h6>URL Actual:</h6>
          <code className="d-block p-2 bg-light">{currentImageUrl}</code>
        </div>
      )}
    </div>
  );
}

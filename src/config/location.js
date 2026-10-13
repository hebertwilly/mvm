// Endereço provisório autorizado para testes. Confirmar antes da publicação.
export const officeAddress = 'Rua Treze de Maio, 939 — Centro, Taquarituba — SP';
const mapQuery = encodeURIComponent(`${officeAddress.replaceAll(' — ', ', ')}, Brasil`);
export const officeMapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
export const officeDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
// Incorporação do Google Maps por pesquisa textual; sem coordenadas ou Place ID presumidos.
export const officeMapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

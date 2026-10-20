const addresses = [
  { name: 'Unidade Taguaí', address: 'Rua Salvador Domingues de Campos, 77, Centro, Taguaí – SP' },
  { name: 'Unidade Taquarituba', address: 'Rua Marechal Floriano Peixoto, 896, Sala 6, Centro, Taquarituba – SP' },
];

export const units = addresses.map((unit) => {
  const query = encodeURIComponent(`${unit.address.replace(' – ', ', ')}, Brasil`);
  return {
    ...unit,
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
    embedUrl: `https://www.google.com/maps?q=${query}&output=embed`,
  };
});

export const coverage = {
  states: 'São Paulo (SP) · Paraná (PR) · Rio de Janeiro (RJ) · Rio Grande do Sul (RS)',
  text: 'Com unidades em Taguaí e Taquarituba, a MVM atende empresas de diferentes regiões, com clientes em São Paulo, Paraná, Rio de Janeiro, Rio Grande do Sul e no Nordeste. Consulte nossa equipe para avaliar o atendimento à sua empresa.',
};

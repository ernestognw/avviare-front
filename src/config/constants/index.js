const overallRoles = {
  ADMIN: 'Administrador',
  USER: 'Usuario',
};

const developmentRoles = {
  ADMIN: 'Administrador',
  EDIFICATION: 'Residente de edificación',
  URBANIZATION: 'Residente de urbanización',
  SALES: 'Ventas',
};

const orders = {
  asc: 'Ascendente',
  desc: 'Descendente',
};

const passwordRegex = /^(?=.*?[A-z])(?=.*?[0-9])(?=.*?[^A-Za-z0-9 ]).{8,}$/;

export { overallRoles, developmentRoles, orders, passwordRegex };

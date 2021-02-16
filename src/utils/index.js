import moment from 'moment';

const list = (toList) => {
  let str = '';
  toList.forEach((value, index) => {
    if (index === toList.length - 2) {
      str += `${value} y `;
    } else if (index === toList.length - 1) {
      str += value;
    } else {
      str += `${value}, `;
    }
  });

  return str;
};

const datePresets = {
  Hoy: [
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'day'),
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
  ],
  Ayer: [
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(2, 'day'),
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'day'),
  ],
  'Este mes': [
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).startOf('month'),
    moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).endOf('month'),
  ],
  'Mes pasado': [
    moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .startOf('month')
      .subtract(1, 'month'),
    moment()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .endOf('month')
      .subtract(1, 'month'),
  ],
};

export { list, datePresets };

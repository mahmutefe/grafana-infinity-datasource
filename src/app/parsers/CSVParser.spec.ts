import { CSVParser } from './CSVParser';

const CSVResults1 = new CSVParser(``, {
  refId: '',
  type: 'csv',
  source: 'inline',
  data: '',
  format: 'table',
  root_selector: '',
  columns: [],
});
describe('CSVParser', () => {
  it('Basic', () => {
    expect(CSVResults1.toTable().rows.length).toBe(0);
    expect(CSVResults1.toTable().columns.length).toBe(0);
  });
});
const CSVResults2 = new CSVParser(
  `
country,population
india,10
usa,7
uk,k
china,11
`,
  {
    refId: '',
    type: 'csv',
    source: 'inline',
    data: '',
    format: 'table',
    root_selector: '',
    columns: [
      {
        text: 'Country',
        type: 'string',
        selector: 'country',
      },
      {
        text: 'Population',
        type: 'number',
        selector: 'population',
      },
    ],
  }
);
describe('CSVParser', () => {
  it('With Columns', () => {
    expect(CSVResults2.toTable().columns.length).toBe(2);
    expect(CSVResults2.toTable().rows.length).toBe(4);
    expect(CSVResults2.toTable().rows[1].length).toBe(2);
    expect(CSVResults2.toTable().rows[1][0]).toBe('usa');
    expect(CSVResults2.toTimeSeries().length).toBe(4);
    expect(CSVResults2.toTimeSeries()[0].target).toBe('india');
    expect(CSVResults2.toTimeSeries()[3].target).toBe('china');
    expect(CSVResults2.toTimeSeries()[3].datapoints.length).toBe(1);
    expect(CSVResults2.toTimeSeries()[3].datapoints[0].length).toBe(2);
    expect(typeof CSVResults2.toTimeSeries()[3].datapoints[0][0]).toBe('number');
    expect(typeof CSVResults2.toTimeSeries()[3].datapoints[0][1]).toBe('number');
    expect(CSVResults2.toTimeSeries()[3].datapoints[0][0]).toBe(11);
  });
});
const CSVResults3 = new CSVParser(
  `
year,country,population
1990,india,10
1990,usa,7
1990,uk,5
1990,china,11
1990,india,11
1990,usa,8
1990,uk,5
1990,china,12
`,
  {
    refId: '',
    type: 'csv',
    source: 'inline',
    data: '',
    format: 'table',
    root_selector: '',
    columns: [
      {
        text: 'Year',
        type: 'timestamp',
        selector: 'year',
      },
      {
        text: 'Country',
        type: 'string',
        selector: 'country',
      },
      {
        text: 'Population',
        type: 'number',
        selector: 'population',
      },
    ],
  }
);
describe('CSVParser', () => {
  it('With Timestamp YYYY And Aggregation', () => {
    expect(CSVResults3.toTable().columns.length).toBe(3);
    expect(CSVResults3.toTable().rows.length).toBe(8);
    expect(CSVResults3.toTable().rows[1].length).toBe(3);
    expect(CSVResults3.toTable().rows[1][1]).toBe('usa');
    expect(CSVResults3.toTimeSeries().length).toBe(4);
    expect(CSVResults3.toTimeSeries()[0].target).toBe('india');
    expect(CSVResults3.toTimeSeries()[3].target).toBe('china');
    expect(CSVResults3.toTimeSeries()[3].datapoints.length).toBe(2);
    expect(CSVResults3.toTimeSeries()[3].datapoints[0].length).toBe(2);
    expect(typeof CSVResults3.toTimeSeries()[3].datapoints[0][0]).toBe('number');
    expect(typeof CSVResults3.toTimeSeries()[3].datapoints[0][1]).toBe('number');
    expect(CSVResults3.toTimeSeries()[3].datapoints[0][1]).toBe(631152000000);
    expect(CSVResults3.toTimeSeries()[3].datapoints[0][0]).toBe(11);
  });
});

const CSVResults4 = new CSVParser(
  `
year,country,population
1990,india,10
1990,usa,7
1990,uk,5
1992,china,11
1990,india,11
1990,usa,8
1990,uk,5
1990,china,12
`,
  {
    refId: '',
    type: 'csv',
    source: 'inline',
    data: '',
    format: 'table',
    root_selector: '',
    columns: [],
  }
);
describe('CSVParser', () => {
  it('Auto Columns Table', () => {
    expect(CSVResults4.toTable().columns.length).toBe(3);
    expect(CSVResults4.toTable().rows.length).toBe(8);
    expect(CSVResults4.toTable().rows[1].length).toBe(3);
    expect(CSVResults4.toTable().rows[3][0]).toBe('1992');
    expect(CSVResults4.toTable().rows[1][1]).toBe('usa');
  });
});
describe('CSVParser', () => {
  it('Parse numbers correctly', () => {
    const parser = new CSVParser(
      `
key,value
"normal number",123
"string number","123"
"number with decimal","123.45"
"number with comma","123,456.78"
`,
      {
        refId: '',
        type: 'csv',
        source: 'inline',
        data: '',
        format: 'table',
        root_selector: '',
        columns: [
          { selector: 'key', type: 'string', text: 'key' },
          { selector: 'value', type: 'number', text: 'value' },
        ],
      }
    );
    expect(parser.toTable().columns.length).toBe(2);
    expect(parser.toTable().rows.length).toBe(4);
    expect(parser.toTable().rows.map((r) => r[1])).toStrictEqual([123, 123, 123.45, 123456.78]);
  });
});
describe('geo map', () => {
  let data = `"lat","long","desc","branches"
"51.5072","0.1276","London","2"
"35.6897","139.6922","Tokyo","3"
"18.9667","72.8333","Mumbai","10"`;
  it('table', () => {
    let input = new CSVParser(data, {
      refId: 'A',
      type: 'csv',
      source: 'inline',
      data,
      root_selector: '',
      format: 'table',
      columns: [
        { selector: 'lat', type: 'number', text: '' },
        { selector: 'long', type: 'number', text: '' },
        { selector: 'desc', type: 'string', text: '' },
        { selector: 'branches', type: 'number', text: '' },
      ],
    });
    expect(input.toTable()).toStrictEqual({
      name: 'A',
      columns: [
        { selector: 'lat', type: 'number', text: 'lat' },
        { selector: 'long', type: 'number', text: 'long' },
        { selector: 'desc', type: 'string', text: 'desc' },
        { selector: 'branches', type: 'number', text: 'branches' },
      ],
      rows: [
        [51.5072, 0.1276, 'London', 2],
        [35.6897, 139.6922, 'Tokyo', 3],
        [18.9667, 72.8333, 'Mumbai', 10],
      ],
    });
  });
});

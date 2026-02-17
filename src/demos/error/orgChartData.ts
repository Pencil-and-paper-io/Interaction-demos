/**
 * Mock org chart data for Error demo.
 */

export type OrgChartPerson = {
  id: string
  name: string
  employeeId: string
  jobTitle: string
  jobRoleId: string
  location: string
  email: string
  phone: string
  mobile: string
  seniorityLevel: string
  department: string
  startDate: string
}

export type OrgChartNode = {
  person: OrgChartPerson
  children: OrgChartNode[]
}

const people: OrgChartPerson[] = [
  {
    id: '1',
    name: 'Abigail Bridge',
    employeeId: '83810',
    jobTitle: 'CTO',
    jobRoleId: '49090269',
    location: 'Chicago, United States',
    email: 'abigail.bridge@demo.com',
    phone: '(312) 555-0100',
    mobile: '(312) 555-0101',
    seniorityLevel: 'Executive',
    department: 'Technology',
    startDate: 'Jan 1, 2018'
  },
  {
    id: '2',
    name: 'John Smith',
    employeeId: '55831',
    jobTitle: 'Network Engineer',
    jobRoleId: '49091698',
    location: 'New York, United States',
    email: 'john.smith@demo.com',
    phone: '(553) 606-2211',
    mobile: '(650) 763-7636',
    seniorityLevel: 'Intermediate - Level 2',
    department: 'IT & Technology',
    startDate: 'Jan 1, 2022'
  },
  {
    id: '3',
    name: 'Jordan Lee',
    employeeId: '55832',
    jobTitle: 'Team lead technical',
    jobRoleId: '49091699',
    location: 'Boston, United States',
    email: 'jordan.lee@demo.com',
    phone: '(553) 606-2212',
    mobile: '(650) 763-7637',
    seniorityLevel: 'Senior - Level 3',
    department: 'IT & Technology',
    startDate: 'Mar 15, 2020'
  },
  {
    id: '4',
    name: 'Omar Khayyám',
    employeeId: '849302',
    jobTitle: 'R&D Head',
    jobRoleId: '49091700',
    location: 'San Francisco, United States',
    email: 'omar.khayyam@demo.com',
    phone: '(415) 555-0200',
    mobile: '(415) 555-0201',
    seniorityLevel: 'Senior - Level 3',
    department: 'R&D',
    startDate: 'Jun 1, 2019'
  },
  {
    id: '5',
    name: 'Manjul Bhargava',
    employeeId: '995831',
    jobTitle: 'Mathematician',
    jobRoleId: '49091701',
    location: 'Princeton, United States',
    email: 'manjul.bhargava@demo.com',
    phone: '(609) 555-0300',
    mobile: '(609) 555-0301',
    seniorityLevel: 'Principal',
    department: 'R&D',
    startDate: 'Sep 1, 2021'
  }
]

function person(id: string): OrgChartPerson {
  const p = people.find((x) => x.id === id)
  if (!p) throw new Error(`Unknown person ${id}`)
  return p
}

/** Root node and children; some branches collapsed by default in UI. */
export const orgChartRoot: OrgChartNode = {
  person: person('1'),
  children: [
    {
      person: person('2'),
      children: []
    },
    {
      person: person('3'),
      children: [
        {
          person: person('5'),
          children: []
        }
      ]
    },
    {
      person: person('4'),
      children: []
    }
  ]
}

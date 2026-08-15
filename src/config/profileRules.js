// Les profils, leurs intitulés et leurs règles sont volontairement centralisés
// afin de pouvoir évoluer sans modifier les composants de l'interface.
export const profiles = [
  {
    code: 'PAT',
    label: 'Personnel administratif et technique',
    matchesCourseCode: (courseCode) => /^(?:TRT|SEM\d)/.test(courseCode),
  },
  {
    code: 'PE',
    label: 'Personnel enseignant',
    matchesCourseCode: (courseCode) => /^(?:CO-|SEM-|EP-|PO-|OMP-)/.test(courseCode),
  },
  {
    code: 'POL',
    label: 'Personnel policier',
    matchesCourseCode: (courseCode) => /^FP/.test(courseCode),
  },
  {
    code: 'PEN',
    label: 'Personnel pénitentiaire',
    matchesCourseCode: (courseCode) => /^OCD/.test(courseCode),
  },
  {
    code: 'PJ',
    label: 'Pouvoir judiciaire',
    matchesCourseCode: (courseCode) => /^PJ-/.test(courseCode),
  },
]

const profilesByCode = Object.fromEntries(
  profiles.map((profile) => [profile.code, profile]),
)

export function matchesProfile(courseCode, profileCode) {
  return profilesByCode[profileCode]?.matchesCourseCode(courseCode) === true
}

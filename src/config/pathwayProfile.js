import { entities } from './entities.js'

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze)
    Object.freeze(value)
  }
  return value
}

function field(maxLength, settings = {}) {
  return {
    type: 'string',
    maxLength,
    requiredInApi: false,
    requiredInForm: false,
    formControl: 'text',
    ...settings,
  }
}

// Options du parcours uniquement : aucune equivalence avec les categories de ciblage.
export const pathwayProfile = freeze({
  scope: 'pathway',
  apiValidation: {
    trimBeforeLengthCheck: true,
    optionalNull: 'omit',
    optionalBlank: 'omit',
    unknownFields: 'ignore',
    enforceOptions: false,
  },
  fields: {
    personnelCategory: field(80, {
      requiredInForm: true,
      formControl: 'select',
      options: [
        { value: 'PAT', label: 'PAT — Personnel administratif et technique' },
        { value: 'PE', label: 'PE — Personnel enseignant' },
        { value: 'PU Police', label: 'Personnel en uniforme — Police' },
        { value: 'PU Prison', label: 'Personnel en uniforme — Prison' },
        { value: 'PJ', label: 'Personnel du Pouvoir judiciaire' },
      ],
    }),
    entity: field(120, {
      allowCustom: true,
      suggestions: entities.map(({ id, label }) => ({ value: id, label })),
    }),
    managerStatus: field(120, {
      formControl: 'select',
      options: [
        { value: 'Nouveau manager', label: 'Nouveau manager' },
        { value: 'Manager expérimenté', label: 'Manager expérimenté' },
        { value: 'Sans responsabilité managériale', label: 'Sans responsabilité managériale' },
      ],
    }),
    role: field(300, { requiredInApi: true, requiredInForm: true, formControl: 'textarea' }),
    objective: field(1000, { requiredInApi: true, requiredInForm: true, formControl: 'textarea' }),
    existingSkills: field(1000, { formControl: 'textarea' }),
    timeAvailable: field(300),
    constraints: field(1000, { formControl: 'textarea' }),
  },
})

export const pathwayProfileFields = pathwayProfile.fields

export function createEmptyPathwayProfile() {
  return Object.fromEntries(Object.keys(pathwayProfileFields).map(name => [name, '']))
}

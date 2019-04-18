export const listDep = req => {
  return {
    ok: true,
    obj: {
      'list': [
        {
          'id': 1,
          'label': '部门1',
          'children': null
        },
        {
          'id': 2,
          'label': '子部门1',
          'children': null
        }
      ],
      'tree': {
        'id': 0,
        'label': '总公司',
        'children': [
          {
            'id': 1,
            'label': '部门1',
            'children': [
              {
                'id': 2,
                'label': '子部门1',
                'children': null
              }
            ]
          }
        ]
      }
    }
  }
}

export const deleteDep = req => {
  return {
    ok: true,
    msg: ''
  }
}

export const addDep = req => {
  return {
    ok: true,
    msg: ''
  }
}

export const updateDep = req => {
  return {
    ok: true,
    msg: ''
  }
}

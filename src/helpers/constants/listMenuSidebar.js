const listMenuSidebar = [
  {
    title: 'Payment Dashboard',
    scopes: [],
    path: '/dashboard',
    icon: 'mdi mdi-view-dashboard',
    childrens: null,
  },
  {
    title: 'Delegation',
    path: '/delegation',
    scopes: [
      'DBM_CLAIM_DEPARTMENTHEAD',
      'DBM_NB_DEPARTMENTHEAD',
      'DBM_POS_DEPARTMENTHEAD',
      'DBM_CCO',
      'DBM_CFO',
      'DBM_POS_UNITHEAD',
      'DBM_CLAIM_CHECKER',
      'DBM_NB_CHECKER',
      'DBM_POS_CHECKER',
      'DBM_POS_UNITMANAGER',
    ],
    childrens: {
      myDelegated: [
        'DBM_CLAIM_DEPARTMENTHEAD',
        'DBM_NB_DEPARTMENTHEAD',
        'DBM_POS_DEPARTMENTHEAD',
        'DBM_CCO',
        'DBM_CFO',
        'DBM_POS_UNITMANAGER',
        'DBM_POS_UNITHEAD',
        'DBM_CLAIM_CHECKER',
        'DBM_NB_CHECKER',
        'DBM_POS_CHECKER',
      ],
      deletedTo: [
        'DBM_CLAIM_DEPARTMENTHEAD',
        'DBM_NB_DEPARTMENTHEAD',
        'DBM_POS_DEPARTMENTHEAD',
        'DBM_CCO',
        'DBM_CFO',
        'DBM_POS_UNITMANAGER',
        'DBM_POS_UNITHEAD',
      ],
    },
    icon: 'mdi mdi-account-group',
  },
];

export default listMenuSidebar;

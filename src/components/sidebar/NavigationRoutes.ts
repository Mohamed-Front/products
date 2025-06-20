export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigation.home',
    meta: {
      icon: 'home'
    }
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'navigation.dashboard',
      show: ['list users'],
      meta: {
        icon: 'dashboard',
      },
    },

 {
      name: 'statistics',
      displayName: 'navigation.users_management',
      show: ['list users', 'list permissions', 'list roles'],
      meta: {
        icon: 'people',
      },
      disabled: true,
      children: [
        {
          name: 'users',
          displayName: 'navigation.users',
          show: 'list users',
          meta: {
            icon: 'person'
          }
        },
        {
          name: 'roles',
          displayName: 'navigation.roles',
          show: 'list roles',
          meta: {
            icon: 'security'
          }
        },
        {
          name: 'Permission',
          displayName: 'navigation.permissions',
          show: 'list permissions',
          meta: {
            icon: 'lock'
          }
        },
      ],
    },

    {
      name: 'Complaint',
      displayName: 'complaints',
      show: ['list complaints'],
      meta: {
        icon: 'dashboard',
      },
    },
    // {
    //       name: 'organizational',
    //       displayName: 'navigation.organizational',
    //       show: ['list complaints'],
    //       meta: {
    //         icon: 'dashboard',
    //       },
    //     },


  ] as INavigationRoute[],
}

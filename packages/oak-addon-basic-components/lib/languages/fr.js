export default {
  addons: {
    basicComponents: {
      fields: {
        image: {
          add: 'Ajouter une image',
          del: 'Supprimer',
        },
      },
      components: {
        title: {
          name: 'Titre',
          settings: {
            title: 'Options de titre',
            type: {
              title: 'Type',
              value: 'Titre',
            },
            content: {
              title: 'Contenu',
            },
          },
        },
        text: {
          name: 'Texte',
          settings: {
            title: 'Options de texte',
            content: {
              title: 'Contenu',
            },
          },
        },
        image: {
          name: 'Image',
          empty: 'Image vide',
          local: 'Image locale',
          settings: {
            title: 'Options d\'image',
            image: {
              title: 'Image',
            },
          },
        },
        button: {
          name: 'Bouton',
          settings: {
            title: 'Options de bouton',
            content: {
              title: 'Contenu',
            },
            action: {
              title: 'Action',
              link: 'Ouvrir un lien',
              event: 'Déclencher un évènement',
            },
            url: {
              title: 'URL du lien',
            },
            event: {
              title: 'Nom de l\'évènement javascript',
            },
            type: {
              title: 'Type d\'élément HTML',
              button: 'Bouton',
              link: 'Lien',
            },
          },
        },
      },
    },
  },
};

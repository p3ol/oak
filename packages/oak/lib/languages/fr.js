export default {
  core: {
    propertyPairSeparator: ' : ',
    groups: {
      core: {
        title: 'Composants basiques',
      },
      other: {
        title: 'Autres composants',
      },
    },
    components: {
      unknown: {
        title: 'Inconnu',
      },
      default: {
        settings: {
          title: 'Options de l\'élément',
        },
      },
      emptySpace: {
        name: 'Espace vide',
        settings: {
          title: 'Options de l\'espace vide',
          height: 'Taille',
        },
      },
      row: {
        name: 'Rangée',
        settings: {
          title: 'Options de rangée',
          flexDirection: {
            title: 'Direction des colonnes',
            row: 'En ligne (de gauche à droite)',
            rowReverse: 'En ligne inversée (de droite à gauche)',
            column: 'En colonne (de haut en bas)',
            columnReverse: 'En colonne inversée (de bas en haut)',
          },
          justifyContent: {
            title: 'Alignement horizontal',
            flexStart: 'Gauche',
            center: 'Centre',
            flexEnd: 'Droite',
            spaceBetween: 'Espace entre les colonnes',
            spaceAround: 'Espace autour des colonnes',
          },
          alignItems: {
            title: 'Alignement vertical',
            flexStart: 'En haut',
            center: 'Centré',
            flexEnd: 'En bas',
          },
          gutters: {
            title: 'Espacement inter-colonnes',
            enabled: 'Activé',
            disabled: 'Désactivé',
          },
        },
      },
      col: {
        settings: {
          title: 'Options de colonne',
          size: {
            title: 'Taille',
            value: 'colonne(s)',
          },
        },
        responsive: {
          hidden: 'Caché',
        },
      },
    },
    settings: {
      title: 'Paramètres',
      cancel: 'Annuler',
      save: 'Sauvegarder',
    },
    styling: {
      title: 'Styles',
      paddings: {
        title: 'Marges internes',
        top: 'Haut',
        right: 'Droite',
        bottom: 'Bas',
        left: 'Gauche',
      },
      margins: {
        title: 'Marges externes',
        top: 'Haut',
        right: 'Droite',
        bottom: 'Bas',
        left: 'Gauche',
      },
      background: {
        image: {
          title: 'Image d\'arrière plan',
        },
        size: {
          title: 'Taille',
          default: 'Par défaut',
          cover: 'Remplir',
          contain: 'S\'adapter',
        },
        position: {
          title: 'Position',
          center: 'Centré',
          top: 'En haut',
          right: 'À droite',
          bottom: 'En bas',
          left: 'À gauche',
          centerTop: 'Centré en haut',
          centerBottom: 'Centré en bas',
          leftCenter: 'Centré à gauche',
          leftTop: 'En haut à gauche',
          leftBottom: 'En bas à gauche',
          rightCenter: 'Centré à droite',
          rightTop: 'En haut à droite',
          rightBottom: 'En bas à droite',
        },
        repeat: {
          title: 'Répétition',
          noRepeat: 'Pas de répétition',
          repeatX: 'Répétition horizontale',
          repeatY: 'Répétition verticale',
          both: 'Répétition horizontale & verticale',
        },
        color: {
          title: 'Couleur d\'arrière plan',
        },
      },
      className: {
        title: 'Classe css additionnelle',
      },
    },
    responsive: {
      title: 'Responsive',
      fluid: 'Flexible',
      show: 'Affiché',
      hide: 'Caché',
      xl: 'Écrans extra-larges',
      lg: 'Écrans larges (ordinateur de bureau)',
      md: 'Écrans moyens (tablettes)',
      sm: 'Petits écrans (téléphones)',
      xs: 'Très petits écrans (anciens téléphones)',
    },
  },
};

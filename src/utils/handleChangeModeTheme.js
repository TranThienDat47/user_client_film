export const handleChangeModeTheme = (mode) => {
   if (mode === 'light') {
      document.documentElement.style.setProperty('--primary', '#fff');
      document.documentElement.style.setProperty('--white', '#fff');
      document.documentElement.style.setProperty('--black', '#E4E6EB');
      document.documentElement.style.setProperty('--border-color', 'rgba(22, 24, 35, 0.13)');

      document.documentElement.style.setProperty(
         '--background-search-color',
         'rgba(255, 255, 255, 1)',
      );
      document.documentElement.style.setProperty(
         '--search-icon-normal-color',
         'rgba(22, 24, 35, 0.34)',
      );
      document.documentElement.style.setProperty('--sperator-color', 'var(--border-color)');

      document.documentElement.style.setProperty('--hover-item-color', 'rgba(23, 26, 39, 0.06)');
      document.documentElement.style.setProperty('--hover-dark-color', 'rgba(255, 255, 255, 0.19)');

      document.documentElement.style.setProperty('--box-shadow-color', 'rgba(23, 26, 39, 0.26)');

      document.documentElement.style.setProperty('--text-color', '#272e34');
      document.documentElement.style.setProperty('--text-bland', 'rgba(23, 26, 39, 0.63)');
      document.documentElement.style.setProperty('--text-bland-down', 'rgba(23, 26, 39, 0.33)');

      document.documentElement.style.setProperty(
         '--tooltip-color',
         'mix(rgba(0, 0, 0, 1), rgba(255, 255, 255, 0.6))',
      );
   } else if (mode === 'dark') {
      document.documentElement.style.setProperty('--primary', '#18191a');
      document.documentElement.style.setProperty('--white', '#18191a');
      document.documentElement.style.setProperty('--black', '#E4E6EB');
      document.documentElement.style.setProperty('--border-color', '#3E4042');

      document.documentElement.style.setProperty('--background-search-color', '#3E4042');
      document.documentElement.style.setProperty('--search-icon-normal-color', '#989ca49c');
      document.documentElement.style.setProperty('--sperator-color', '#E4E6EB');

      document.documentElement.style.setProperty('--hover-item-color', '#3E4042');
      document.documentElement.style.setProperty('--hover-dark-color', '#3e404229');

      document.documentElement.style.setProperty('--box-shadow-color', '#e4e6eb63');

      document.documentElement.style.setProperty('--text-color', '#E4E6EB');
      document.documentElement.style.setProperty('--text-bland', '#E4E6EB');
      document.documentElement.style.setProperty('--text-bland-down', '#E4E6EB');

      document.documentElement.style.setProperty('--tooltip-color', '#E4E6EB');
   }
};

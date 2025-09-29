import { generateNavigationConfig } from "./navConfig.jsx";

export const hasAccessToPath = (path, user) => {
  if (!user || !user.accessibleProjects || !user.projectRoles) {
    return false;
  }

  const navItems = generateNavigationConfig(user.accessibleProjects, user.projectRoles);
  
  const findPathInNav = (items, targetPath) => {
    for (const item of items) {
      if (item.path === targetPath) {
        return true;
      }
      
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.path === targetPath) {
            return true;
          }
        }
      }
    }
    return false;
  };

  return findPathInNav(navItems, path);
};

export const getFirstAccessiblePath = (user) => {
  if (!user || !user.accessibleProjects || !user.projectRoles) {
    return '/dashboard';
  }

  const navItems = generateNavigationConfig(user.accessibleProjects, user.projectRoles);
  
  for (const item of navItems) {
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems[0].path;
    }
  }

  return '/dashboard';
};

export const getAccessiblePaths = (user) => {
  if (!user || !user.accessibleProjects || !user.projectRoles) {
    return ['/dashboard'];
  }

  const navItems = generateNavigationConfig(user.accessibleProjects, user.projectRoles);
  
  const paths = [];
  navItems.forEach(item => {
    paths.push(item.path);
    if (item.subItems) {
      item.subItems.forEach(subItem => {
        paths.push(subItem.path);
      });
    }
  });
  
  return paths;
};

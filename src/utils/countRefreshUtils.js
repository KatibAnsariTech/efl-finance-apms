const hasProjectAccess = (accessibleProjects, projectIdentifiers) => {
  if (!accessibleProjects || !Array.isArray(accessibleProjects)) {
    return false;
  }

  const identifiers = Array.isArray(projectIdentifiers)
    ? projectIdentifiers
    : [projectIdentifiers];

  return accessibleProjects.some((project) => {
    if (typeof project === "string") {
      return identifiers.includes(project);
    }

    if (typeof project === "object" && project !== null) {
      return identifiers.some(
        (identifier) =>
          project.id === identifier || project.projectId === identifier
      );
    }

    return false;
  });
};

export const refreshUserCounts = async (user, refreshFunctions) => {
  if (!user || !user.accessibleProjects) {
    return;
  }

  const accessibleProjects = user.accessibleProjects;
  const refreshPromises = [];

  Object.entries(refreshFunctions).forEach(([projectType, refreshFunction]) => {
    if (typeof refreshFunction === "function") {
      const hasAccess = hasProjectAccess(accessibleProjects, [projectType]);

      if (hasAccess) {
        refreshPromises.push(
          refreshFunction().catch((error) => {
            console.error(`Error refreshing ${projectType} counts:`, error);
          })
        );
      }
    }
  });

  if (refreshPromises.length > 0) {
    try {
      await Promise.all(refreshPromises);
    } catch (error) {
      console.error("Error during count refresh:", error);
    }
  }
};

export default {
  refreshUserCounts,
  hasProjectAccess,
};

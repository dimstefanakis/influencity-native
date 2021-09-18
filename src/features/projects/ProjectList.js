/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View} from 'react-native';
import Project from './Project';

// Usage is identical to ./MyCreatedProjects and ./MyProjects
// but this components accepts params and a "projectList" prop
// Using this for now to prevent spaghetti variables in a single component
function ProjectsList({route, projectList = []}) {
  const projects = route ? route.params.projects : projectList;
  const viewAs = route ? route.params.viewAs : 'sub';

  return (
    <View
      style={{
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
      }}>
      {projects.map((project) => {
        return <Project project={project} viewAs={viewAs} />;
      })}
    </View>
  );
}

export default ProjectsList;

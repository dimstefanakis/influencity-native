import React from 'react';
import Project from './Project';

function ProjectPreview({project}) {
  return <Project viewAs="preview" project={project} />;
}

export default ProjectPreview;

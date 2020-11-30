import { SkeletonText } from 'carbon-components-react';
import TreeView, { TreeNode } from 'carbon-components-react/lib/components/TreeView';
import React, { useCallback, useMemo } from 'react';
import { IDocTreeItem, useDocTree } from '../context/DocTree';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import styles from './Sider.module.scss';

interface INavItemProps {
  id: string;
  value?: any;
  label?: React.ReactNode;
  children?: INavItemProps[];
  isExpanded?: boolean;
}

function dummy() {}

function renderTree(nodes?: INavItemProps[], expanded?: boolean) {
  if (!nodes) {
    return;
  }
  return nodes.map(({ children, isExpanded, ...nodeProps }) => (
    <TreeNode
      key={nodeProps.id}
      isExpanded={expanded ?? isExpanded}
      onToggle={dummy}
      {...nodeProps}
    >
      {renderTree(children, expanded)}
    </TreeNode>
  ));
}

function mapDocTreeItem(nodes?: IDocTreeItem[]): INavItemProps[] {
  return (nodes ?? [])?.map((node) => {
    const optionalChildren: any = {};
    if (node.mimeType === 'application/vnd.google-apps.folder') {
      optionalChildren.children = mapDocTreeItem(node.children);
    }
    return {
      id: node.id,
      label: node.name,
      value: node,
      ...optionalChildren,
    } as INavItemProps;
  });
}

function Sider({ isExpanded = true }: { isExpanded?: boolean }) {
  const { loading, data } = useDocTree();
  const treeData = useMemo(() => mapDocTreeItem(data), [data]);

  const history = useHistory();

  const handleSelect = useCallback((_ev, node) => {
    const file = node.value as IDocTreeItem;
    console.log(file.mimeType);
    switch (file.mimeType) {
      case 'application/vnd.google-apps.document':
        history.push(`/doc/${file.id}`);
        break;
      case 'application/vnd.google-apps.folder':
        history.push(`/folder/${file.id}`);
        break;
    }
  }, []);

  return (
    <div className={cx(styles.sider, { [styles.isExpanded]: isExpanded })}>
      {loading && (
        <div className={styles.skeleton}>
          <SkeletonText paragraph />
        </div>
      )}
      {!loading && (
        <TreeView label="Table of Content" selected={[]} onSelect={handleSelect}>
          {renderTree(treeData, false)}
        </TreeView>
      )}
    </div>
  );
}

export default React.memo(Sider);

function Content_({
  isExpanded = true,
  children,
}: {
  isExpanded?: boolean;
  children?: React.ReactNode;
}) {
  return <div className={cx(styles.content, { [styles.isExpanded]: isExpanded })}>{children}</div>;
}

export const Content = React.memo(Content_);
# Node Relations

## Methods

```typescript
bloko.crud.nodeRelations.findAll(): Promise<NodeRelation[]>
bloko.crud.nodeRelations.findById(id: string): Promise<NodeRelation | null>
bloko.crud.nodeRelations.findByFrom(fromNodeId: string): Promise<NodeRelation[]>
bloko.crud.nodeRelations.findByTo(toNodeId: string): Promise<NodeRelation[]>
bloko.crud.nodeRelations.findByType(typeId: string): Promise<NodeRelation[]>
bloko.crud.nodeRelations.findByNodes(fromNodeId: string, toNodeId: string): Promise<NodeRelation[]>
bloko.crud.nodeRelations.create(data: NodeRelationInsert): Promise<NodeRelation>
bloko.crud.nodeRelations.update(id: string, data: NodeRelationUpdate): Promise<NodeRelation | null>
bloko.crud.nodeRelations.delete(id: string): Promise<boolean>
```

## Types

```typescript
interface NodeRelation {
  id: string;
  _from: string;
  _to: string;
  _node_relation_type: string;
}

type NodeRelationInsert = Omit<NodeRelation, 'id'>;
type NodeRelationUpdate = Partial<NodeRelationInsert>;
```

## Examples

```typescript
// Create a relation between nodes
const relation = await bloko.crud.nodeRelations.create({
  _from: nodeA.id,
  _to: nodeB.id,
  _node_relation_type: relationType.id,
});

// Find all relations from a node
const outgoing = await bloko.crud.nodeRelations.findByFrom(nodeA.id);

// Find all relations to a node
const incoming = await bloko.crud.nodeRelations.findByTo(nodeB.id);

// Get related nodes
const relations = await bloko.crud.nodeRelations.findByFrom(nodeId);
const relatedNodes = await Promise.all(
  relations.map(r => bloko.crud.nodes.findById(r._to))
);
```

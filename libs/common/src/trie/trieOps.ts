import { Type } from 'class-transformer';

export class TrieNode {
  public val: string;
  public score: number;
  @Type(() => TrieNode)
  public children: Map<string, TrieNode>;
  public isEnd: boolean;

  constructor(ch: string, score = 1) {
    this.val = ch;
    this.score = score;
    this.children = new Map();
    this.isEnd = false;
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode('');
  }

  insert(word: string, score = 1) {
    let index = this.root;
    for (let ch of word) {
      const node = index.children.get(ch) || new TrieNode(ch);
      index.children.set(ch, node);
      index = node;
    }
    index.isEnd = true;
    index.score = score;
  }

  findPrefixNode(prefix: string) {
    if (!prefix) return this.root;

    let index = this.root;
    for (let ch of prefix) {
      if (index.children.has(ch)) {
        index = index.children.get(ch);
      } else return null;
    }

    return index;
  }

  toList() {
    let index = this.root;
    return recur(index);
  }
}

function recur(node: TrieNode, prefix = '') {
  const nodes = [{ prefix: prefix, value: getAllValidChildren(node, prefix) }];

  for (let [ch, child] of node.children) {
    const childValidNodes = recur(child, prefix + ch);
    nodes.push(...childValidNodes);
  }
  return nodes;
}

export function getAllValidChildren(node: TrieNode, prefix = '') {
  if (!node || !node.children) return [];

  let children = [];
  let index = node;
  if (node.isEnd) children.push({ query: prefix, score: node.score });
  for (let [ch, child] of index.children) {
    let validNodes = getAllValidChildren(child, prefix + child.val);
    children.push(...validNodes);
  }
  return children;
}

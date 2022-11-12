import { Type } from 'class-transformer';

export class TrieNode {
  public val: string;
  @Type(() => TrieNode)
  public children: Map<string, TrieNode>;
  public isEnd: boolean;

  constructor(ch: string) {
    this.val = ch;
    this.children = new Map();
    this.isEnd = false;
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode('');
  }

  insert(word: string) {
    let index = this.root;
    for (let ch of word) {
      const node = index.children.get(ch) || new TrieNode(ch);
      index.children.set(ch, node);
      index = node;
    }
    index.isEnd = true;
  }
}

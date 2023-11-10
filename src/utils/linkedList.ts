class ListNode<T> {
  value: T
  next: ListNode<T> | null

  constructor (value: T) {
    this.value = value
    this.next = null
  }
}

class LinkedList<T> {
  head: ListNode<T> | null

  // 批量转换数组数据为节点到链表尾部
  constructor (values: T[]) {
    this.head = null
    for (const value of values) {
      const newNode = new ListNode<T>(value)
      if (this.head == null) {
        // 如果链表为空，将新节点设置为头部节点
        this.head = newNode
        newNode.next = this.head
      } else {
        // 找到链表尾部节点，并将新节点添加到尾部
        let currentNode: ListNode<T> | null = this.head
        while (currentNode?.next !== this.head) {
          currentNode = currentNode?.next ?? null
        }
        currentNode.next = newNode
        newNode.next = this.head
      }
    }
  }
}

/** 单向循环链表 */
export default LinkedList

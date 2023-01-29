import {
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  limit,
  orderBy,
  QueryConstraint,
  startAfter,
} from 'firebase/firestore';

export async function buildPaginationConstraint(
  limit_: number,
  startAfterId = '',
  collectionRef: CollectionReference<DocumentData> = null,
) {
  const queryConstraints: QueryConstraint[] = [orderBy('query'), limit(limit_)];
  if (startAfterId && collectionRef) {
    const docSnap = await getDoc(doc(collectionRef, startAfterId));
    queryConstraints.push(startAfter(docSnap));
  }
  return queryConstraints;
}

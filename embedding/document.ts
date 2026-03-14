import { Document } from '@langchain/core/documents'

const test = new Document({ pageContent: 'test text', metadata: { source: 'ABC Title' } })

console.log(test) // Output: test text

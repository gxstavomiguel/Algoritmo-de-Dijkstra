class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(key, value) {
        this.heap.push({ key, value });
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.bubbleDown(0);
        }
        return min;
    }

    bubbleUp(index) {
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].value <= this.heap[index].value) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let swap = null;

            if (leftChildIndex < length) {
                if (this.heap[leftChildIndex].value < this.heap[index].value) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                if (
                    (swap === null && this.heap[rightChildIndex].value < this.heap[index].value) ||
                    (swap !== null && this.heap[rightChildIndex].value < this.heap[leftChildIndex].value)
                ) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) break;
            [this.heap[swap], this.heap[index]] = [this.heap[index], this.heap[swap]];
            index = swap;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

class Grafo {
    constructor() {
        this.vertices = {};
    }

    adicionarVertice(vertice) {
        this.vertices[vertice] = {};
    }

    adicionarAresta(origem, destino, peso) {
        if (!this.vertices[origem] || !this.vertices[destino]) {
            console.log("Vértices não existem!");
            return;
        }
        this.vertices[origem][destino] = peso;
    }

    dijkstra(origem) {
        const distancias = {};
        const antecessores = {};
        const heap = new MinHeap();

        for (const vertice in this.vertices) {
            distancias[vertice] = Infinity;
            antecessores[vertice] = null;
        }

        distancias[origem] = 0;
        heap.insert(origem, 0);

        while (!heap.isEmpty()) {
            const { key: verticeAtual, value: distanciaAtual } = heap.extractMin();

            for (const vizinho in this.vertices[verticeAtual]) {
                const peso = this.vertices[verticeAtual][vizinho];
                const distanciaTotal = distanciaAtual + peso;

                if (distanciaTotal < distancias[vizinho]) {
                    distancias[vizinho] = distanciaTotal;
                    antecessores[vizinho] = verticeAtual;
                    heap.insert(vizinho, distanciaTotal);
                }
            }
        }

        return { distancias, antecessores };
    }

    caminhoMinimoDijkstra(origem, destino) {
        const { distancias, antecessores } = this.dijkstra(origem);
        const caminho = [];
        let atual = destino;

        while (atual) {
            caminho.unshift(atual);
            atual = antecessores[atual];
        }

        return caminho.length > 1 ? caminho : null;
    }
}

const grafo = new Grafo();
const vertices = ['0', '1', '2', '3', '4', '5', '6'];
const arestas = [
    ['0', '1', 7], ['0', '2', 9], ['0', '5', 14],
    ['1', '2', 10], ['1', '3', 15],
    ['2', '3', 11], ['2', '5', 2],
    ['3', '4', 6],
    ['4', '5', 9], ['4', '6', 2]
];
vertices.forEach(vertice => grafo.adicionarVertice(vertice));
arestas.forEach(([origem, destino, peso]) => grafo.adicionarAresta(origem, destino, peso));

const inicio = new Date().getTime();
const { distancias, antecessores } = grafo.dijkstra('0');
const fim = new Date().getTime();
console.log(`Tempo de execução do algoritmo de Dijkstra com MinHeap: ${fim - inicio} ms`);

console.log("Caminhos mínimos de 0 até 6:", grafo.caminhoMinimoDijkstra('0', '6'));

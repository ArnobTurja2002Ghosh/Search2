import { TileNode } from './TileNode.js';
import * as THREE from 'three';
import { MapRenderer } from './MapRenderer';
import { PriorityQueue } from './PriorityQueue';
export class GameMap {
	
	// Constructor for our GameMap class
	constructor() {

		// Create our graph
		// Which is an array of nodes
		this.graph = [];

		// Define some basics of our world
		// Let's use the previous area that we had
		// our character navigating around
		// This started at location (-25,0,-25)
		// and had width of 50 and a depth of 50
		this.start = new THREE.Vector3(-25,0,-25);

		this.width = 50;
		this.depth = 50;
		
		// We also need to define a tile size 
		// for our tile based map
		this.tileSize = 5;

		// Get our columns and rows based on
		// width, depth and tile size
		this.cols = this.width/this.tileSize;
		this.rows = this.depth/this.tileSize;

		// Create our map renderer
		this.mapRenderer = new MapRenderer(this.start, this.tileSize, this.cols);
	}

	init() {
		this.initGraph();
		// Set the game object to our rendering
		this.gameObject = this.mapRenderer.createRendering(this.graph);
	}



	// Initialize our game graph
	initGraph() {

		// Create a new tile node
		// for each index in the grid
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {

				let type = TileNode.Type.Ground;
				let node = new TileNode(this.graph.length, type);
				this.graph.push(node);
			}
		}

		// A graph map that won't fail
		this.graph[3].type = TileNode.Type.Obstacle;
		this.graph[4].type = TileNode.Type.Obstacle;
		this.graph[5].type = TileNode.Type.Obstacle;
		this.graph[10].type = TileNode.Type.Obstacle;
		this.graph[13].type = TileNode.Type.Obstacle;
		this.graph[19].type = TileNode.Type.Obstacle;
		this.graph[26].type = TileNode.Type.Obstacle;
		this.graph[30].type = TileNode.Type.Obstacle;
		this.graph[36].type = TileNode.Type.Obstacle;
		this.graph[41].type = TileNode.Type.Obstacle;
		this.graph[42].type = TileNode.Type.Obstacle;
		this.graph[44].type = TileNode.Type.Obstacle;
		this.graph[47].type = TileNode.Type.Obstacle;
		this.graph[55].type = TileNode.Type.Obstacle;
		this.graph[56].type = TileNode.Type.Obstacle;
		this.graph[57].type = TileNode.Type.Obstacle;
		this.graph[58].type = TileNode.Type.Obstacle;
		this.graph[61].type = TileNode.Type.Obstacle;
		this.graph[71].type = TileNode.Type.Obstacle;
		this.graph[73].type = TileNode.Type.Obstacle;
		this.graph[74].type = TileNode.Type.Obstacle;
		this.graph[75].type = TileNode.Type.Obstacle;
		this.graph[78].type = TileNode.Type.Obstacle;
		this.graph[79].type = TileNode.Type.Obstacle;
		this.graph[82].type = TileNode.Type.Obstacle;
		this.graph[83].type = TileNode.Type.Obstacle;
		this.graph[89].type = TileNode.Type.Obstacle;
		this.graph[90].type = TileNode.Type.Obstacle;
		this.graph[92].type = TileNode.Type.Obstacle;
		// Create left, right, top, bottom
		// edges for each node in our graph
		for (let j = 0; j < this.rows; j++) {
			for (let i = 0; i < this.cols; i++) {

				// The index of our current node
				let index = j * this.cols + i;
				let current = this.graph[index];

				if (current.type == TileNode.Type.Ground) {

					if (i > 0) {
						// CREATE A LEFT EDGE
						let left = this.graph[index - 1];
						current.tryAddEdge(left, this.tileSize);
					}

					if (i < this.cols - 1) {
						// CREATE A RIGHT EDGE
						let right = this.graph[index + 1];
						current.tryAddEdge(right, this.tileSize);
					}

					if (j > 0) {
						// CREATE A TOP EDGE
						let top = this.graph[index-this.cols];
						current.tryAddEdge(top, this.tileSize);
					}

					if (j < this.rows - 1) {
						// CREATE A BOTTOM EDGE
						let bottom = this.graph[index+this.cols];
						current.tryAddEdge(bottom, this.tileSize);
					}
				}

			}
		}

	}

	// Method to get the location of a node
	localize(node) {
		let i = node.id%this.cols;
		let j = Math.floor(node.id/this.cols);

		return new THREE.Vector3(this.start.x+(i*this.tileSize)+this.tileSize*0.5, this.tileSize, this.start.z+(j*this.tileSize)+this.tileSize*0.5);
	}


	// TODO: A2
	manhattanDistance(node, end) {
	
	}

	// TODO: A2
	astar(startIndex, endIndex) {
	
		let open=new PriorityQueue();
		// to our open list, add the start node
		

		let closed = [];

		let start = this.graph[startIndex];
		let end = this.graph[endIndex];

		// This is for our table
		let parent = [];
		let manhattan_costs = [];
		let gcosts=[0];

		for (let node of this.graph) {
			manhattan_costs[node.id]=this.tileSize*Math.abs(node.id%this.cols-end.id%this.cols) + this.tileSize*Math.abs(Math.floor(node.id/this.cols)-Math.floor(end.id/this.cols));
			parent[node.id] = null;
		}
		console.log(gcosts);
		console.log(manhattan_costs);
		open.enqueue(this.graph[startIndex], 0+manhattan_costs[startIndex]);
		while(!open.isEmpty()){
			let current= open.dequeue();
			if(current==this.graph[endIndex]){
				return this.backtrack(this.graph[startIndex], this.graph[endIndex], parent);
			}
			for (let edge of current.edges) {
				let gCost = edge.cost + gcosts[current.id];
				if (!closed.includes(edge.node) && !open.includes(edge.node)) {
					open.enqueue(edge.node, gCost+manhattan_costs[edge.node.id]);
					parent[edge.node.id]=current;
					gcosts[edge.node.id]=gCost;
				}
			}
			closed.push(current);
		}
	}


	// TODO: A2
	backtrack(start, end, parents) {
		//console.log(parents);
		let node = end;
		let path = [];
		path.push(node);
		while (node != start) {
			if (node == null)
				return;
			path.push(parents[node.id]);
			node = parents[node.id];
		}
		return path.reverse();
	}

}
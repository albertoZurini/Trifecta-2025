import {
  NodeData
} from '@/lib/workflowExecutor';
import {
  Handle, Position, useNodeConnections, useNodesData, useReactFlow,
  type NodeProps,
  type Node,
} from '@xyflow/react';

import {
  useState,
  useEffect
} from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs'
import { ApexOptions } from 'apexcharts';

interface ChartState {
  options: ApexOptions;
  series: {
    name: string;
    data: { x: Date; y: number[] }[];
  }[];
}

interface ChartData {
  x: Date;
  y: number[];
}

function convertMarketData(data: Record<string, any>): ChartData[] {
  const result: ChartData[] = [];
  for (const dateString in data) {
    if (data.hasOwnProperty(dateString)) {
      const entry = data[dateString];
      result.push({
        x: new Date(dateString),
        y: [entry.open, entry.high, entry.low, entry.close]
      });
    }
  }
  return result;
}

export function CandleChartModal({ node }: { node: Node<NodeData> }) {
  const [state, setState] = useState<ChartState>({
    options: {
      chart: {
        height: 350,
        type: 'candlestick'
      },
      title: {
        text: 'CandleStick Chart',
        align: 'left'
      },
      annotations: {
        xaxis: [
          {
            x: 'Oct 06 14:00',
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                fontSize: '12px',
                color: '#fff',
                background: '#00E396'
              },
              orientation: 'horizontal',
              offsetY: 7,
              text: 'Annotation Test'
            }
          }
        ]
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        type: 'category',
        labels: {
          formatter: function (val: string) {
            return dayjs(val).format('MMM DD HH:mm');
          }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    },
    series: [{
      name: 'candle',
      data: []
    }]
  });

  useEffect(() => {
    if (node.data.prices) {
      const convertedPrices = convertMarketData(node.data.prices);
      setState(prev => ({
        ...prev,
        series: [{
          name: 'candle',
          data: convertedPrices
        }]
      }));
    }
  }, [node.data.prices]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="candlestick"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

"""Original mechanism diagrams; coordinates, codes and scores are illustrative."""
from html import escape
from pathlib import Path
import math
import textwrap

INK='#0F1F2E'; PAPER='#FAF6EE'; WARM='#F4ECDC'; TEAL='#1E5F70'
CORAL='#E85A2B'; GOLD='#F4B860'; MUTED='#6B6356'; MIST='#E5DDD0'; GREEN='#0F7D4B'

class Figure:
    def __init__(self,title,desc,height=720):
        extra=20 if len(textwrap.wrap(title,38,break_long_words=False,break_on_hyphens=False))>1 else 0
        height += extra
        self.height=height
        self.offset=0
        self.parts=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 {height}" width="640" height="{height}" role="img" aria-labelledby="title desc">',f'<title id="title">{escape(title)}</title>',f'<desc id="desc">{escape(desc)}</desc>',f'<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1 L7 4 L1 7" fill="none" stroke="{TEAL}" stroke-width="1.5"/></marker></defs>',f'<rect width="640" height="{height}" fill="{PAPER}"/>']
        self.text(28,30,'MILVUS / AI REFERENCE / MECHANISM',12,MUTED)
        self.text(28,72,title,27,INK,width=38,bold=True,serif=True)
        self.offset=extra
    def text(self,x,y,s,size=20,color=INK,width=54,bold=False,anchor='start',serif=False):
        y += self.offset
        ls=textwrap.wrap(s,width,break_long_words=False,break_on_hyphens=False)
        spans=''.join(f'<tspan x="{x}" dy="{0 if i==0 else size*1.3:g}">{escape(t)}</tspan>' for i,t in enumerate(ls))
        self.parts.append(f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-family="{"Georgia, serif" if serif else "Arial, sans-serif"}" font-size="{size}" fill="{color}" font-weight="{700 if bold else 400}">{spans}</text>')
    def rect(self,x,y,w,h,fill=WARM,stroke=INK,dash=False):
        y += self.offset
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"'+(' stroke-dasharray="6 5"' if dash else '')+'/>')
    def line(self,x1,y1,x2,y2,color=TEAL,arrow=False,dash=False):
        y1 += self.offset; y2 += self.offset
        self.parts.append(f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="2"'+(' marker-end="url(#arrow)"' if arrow else '')+(' stroke-dasharray="6 5"' if dash else '')+'/>')
    def circle(self,x,y,r=7,fill=TEAL,stroke=INK,dash=False):
        y += self.offset
        self.parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="1.5"'+(' stroke-dasharray="5 4"' if dash else '')+'/>')
    def cross(self,x,y,color=MUTED):
        self.line(x-7,y-7,x+7,y+7,color);self.line(x-7,y+7,x+7,y-7,color)
    def footer(self,s):
        offset=self.offset; self.offset=0
        self.line(28,self.height-76,612,self.height-76,INK)
        self.text(28,self.height-48,s,18,MUTED,width=60)
        self.offset=offset
    def finish(self):return '\n'.join(self.parts+['</svg>'])+'\n'


def retrieval():
    f=Figure('Similarity finds candidates; scope limits them','A query lies near selected eligible vectors A, B and C. A closer point from another tenant is excluded. Returned IDs lead back to source evidence.',760)
    f.text(28,133,'1  Search inside the eligible scope',22,bold=True)
    f.rect(55,156,530,308,fill=PAPER,stroke=MIST)
    f.circle(270,290,94,fill='none',stroke=TEAL,dash=True)
    for x,y in [(95,210),(140,400),(420,190),(505,290),(470,400),(355,435)]:f.circle(x,y,6,fill=MIST,stroke=MUTED)
    for label,x,y in [('A',305,255),('B',225,235),('C',280,360)]:
        f.line(270,290,x,y,dash=True);f.circle(x,y,10,fill=GREEN);f.text(x+14,y-10,label,22,GREEN,bold=True)
    f.circle(270,290,11,fill=CORAL);f.text(185,310,'query',22,CORAL,bold=True)
    f.cross(285,285);f.text(355,325,'Other tenant:',19,MUTED,width=20);f.text(355,350,'excluded',19,MUTED)
    f.line(300,290,345,320,MUTED)
    f.text(28,505,'2  Resolve IDs to evidence',22,bold=True)
    for i,label in enumerate(['A','B','C']):
        x=40+i*198;f.rect(x,530,178,98);f.text(x+15,563,'Source '+label,22,bold=True);f.line(x+15,582,x+150,582,MUTED);f.line(x+15,600,x+110,600,MUTED)
    f.footer('2D schematic. Eligibility is mandatory; ANN may miss true neighbors.')
    return f


def hnsw():
    f=Figure('HNSW: coarse hops, then local exploration','Upper layers contain fewer nodes and permit coarse navigation. Search descends to the bottom layer and explores a candidate frontier. M controls graph connectivity and ef controls search effort.',790)
    levels=[(190,[(100,190),(315,190),(530,190)]),(350,[(100,350),(220,350),(315,350),(425,350),(530,350)]),(525,[(100,525),(170,490),(220,565),(285,510),(315,560),(425,490),(485,540),(530,525),(550,500)])]
    f.text(28,135,'Upper layers: fewer nodes, longer hops',21,bold=True)
    for _,nodes in levels:
        for a,b in zip(nodes,nodes[1:]):f.line(*a,*b,MIST)
        for x,y in nodes:f.circle(x,y,10,fill=PAPER)
    for a,b in [((100,190),(315,190)),((315,190),(530,190)),((530,190),(530,350)),((530,350),(530,525)),((530,525),(485,540)),((530,525),(425,490)),((530,525),(550,500))]:f.line(*a,*b,arrow=True)
    for x,y in [(100,190),(315,190),(530,190),(530,350),(530,525)]:f.circle(x,y,10,fill=TEAL)
    for x,y in [(425,490),(485,540),(550,500)]:f.circle(x,y,12,fill=GOLD)
    f.circle(490,455,8,fill=CORAL);f.text(510,453,'q',23,CORAL,bold=True)
    f.text(28,286,'Descend near the query',21,bold=True)
    f.text(28,430,'Bottom layer: explore several candidates',21,bold=True)
    f.text(28,628,'M: graph links  |  ef: search candidate budget',20)
    f.footer('The highlighted path is illustrative, not a guaranteed search trace.')
    return f


def ivf():
    f=Figure('IVF probes lists around selected centroids','Four schematic cells have one centroid each. With nprobe set to two, the query probes the two closer centroids on the left and scores their list members. Unprobed lists are skipped.',760)
    f.text(28,136,'nlist = 4  |  nprobe = 2',23,bold=True)
    centers=[(190,245),(450,245),(190,445),(450,445)]
    for i,(x,y) in enumerate(centers):
        selected=i in [0,2];f.rect(x-112,y-83,224,166,fill=WARM if selected else PAPER,stroke=TEAL if selected else MIST)
        for dx,dy in [(-65,-30),(-25,40),(50,-43),(64,25),(-70,45)]:f.circle(x+dx,y+dy,6,fill=TEAL if selected else MIST,stroke=TEAL if selected else MUTED)
        f.rect(x-8,y-8,16,16,fill=GOLD);f.text(x+16,y+6,'c'+str(i+1),20)
    f.circle(280,335,10,fill=CORAL);f.text(300,341,'q',22,CORAL,bold=True)
    f.line(280,335,190,245,arrow=True);f.line(280,335,190,445,arrow=True)
    f.text(28,575,'Probe centroids → score vectors in those lists',21,bold=True)
    f.text(28,616,'More probes inspect more lists and do more work.',20,MUTED)
    f.footer('Schematic cells. ANN can miss a neighbor in an unprobed list.')
    return f


def ann_families():
    f=Figure('Three ways to narrow the candidate set','Hashing selects colliding buckets; graph search follows neighbor edges; IVF chooses lists associated with nearby centroids. These select candidates rather than representing vector compression.',800)
    ys=[155,350,545]
    for y in ys:f.line(28,y-15,612,y-15,MIST)
    f.text(28,ys[0]+12,'Hash / LSH',22,bold=True)
    for i in range(3):
        x=45+i*80;f.rect(x,ys[0]+42,64,66,fill=WARM if i==1 else PAPER,stroke=TEAL if i==1 else MIST)
        for k in range(i+1):f.circle(x+14+k*15,ys[0]+76,5,fill=TEAL if i==1 else MIST)
    f.circle(190,ys[0]+12,7,fill=CORAL);f.line(190,ys[0]+23,155,ys[0]+40,arrow=True)
    f.text(320,ys[0]+55,'Inspect colliding buckets.',20,width=26)
    f.text(320,ys[0]+101,'Collisions are candidates.',19,MUTED,width=27)
    f.text(28,ys[1]+12,'Graph / HNSW',22,bold=True)
    nodes=[(55,ys[1]+80),(115,ys[1]+45),(170,ys[1]+95),(240,ys[1]+55)]
    for a,b in zip(nodes,nodes[1:]):f.line(*a,*b,arrow=True)
    for x,y in nodes:f.circle(x,y,8,fill=TEAL)
    f.circle(270,ys[1]+95,7,fill=CORAL)
    f.text(320,ys[1]+55,'Follow neighbor links.',20,width=26)
    f.text(320,ys[1]+101,'Explore near the query.',19,MUTED,width=27)
    f.text(28,ys[2]+12,'IVF',22,bold=True)
    for i,(x,y) in enumerate([(75,ys[2]+65),(160,ys[2]+90),(245,ys[2]+55)]):
        f.circle(x,y,28,fill=WARM if i==1 else PAPER,stroke=TEAL if i==1 else MIST);f.rect(x-5,y-5,10,10,fill=GOLD)
    f.circle(160,ys[2]+40,7,fill=CORAL);f.line(160,ys[2]+48,160,ys[2]+80,arrow=True)
    f.text(320,ys[2]+55,'Probe selected lists.',20,width=26)
    f.text(320,ys[2]+101,'Skip the other regions.',19,MUTED,width=27)
    f.footer('MINHASH_LSH in Milvus is a binary MinHash / Jaccard path.')
    return f


def metrics():
    f=Figure('The same query can produce different rankings','For query q=(1,0), vector A=(0.8,0.6), and B=(2,0), cosine and inner product rank B first while squared L2 ranks A first. All coordinates and scores are toy calculations.',800)
    ox,oy,scale=90,350,180
    f.line(ox,oy,550,oy,INK);f.line(ox,oy,ox,155,INK)
    q=(ox+scale,oy);a=(ox+.8*scale,oy-.6*scale);b=(ox+2*scale,oy)
    f.line(ox,oy,*a,TEAL,arrow=True);f.line(ox,oy,*b,GOLD,arrow=True);f.line(ox,oy,*q,CORAL,arrow=True)
    f.line(*a,a[0],oy,MUTED,dash=True);f.line(*a,*q,TEAL,dash=True)
    for p,c in [(q,CORAL),(a,TEAL),(b,GOLD)]:f.circle(*p,8,fill=c)
    f.text(45,380,'O',21);f.text(240,390,'q=(1,0)',20,CORAL);f.text(135,205,'A=(0.8,0.6)',21,TEAL);f.text(440,385,'B=(2,0)',20)
    f.text(28,455,'Metric',21,bold=True);f.text(235,455,'A',21,bold=True);f.text(360,455,'B',21,bold=True);f.text(470,455,'Closer',21,bold=True)
    for y,label,x,yv,winner in [(505,'Cosine',.8,1.0,'B'),(565,'Inner product',.8,2.0,'B'),(625,'Squared L2',.4,1.0,'A')]:
        f.line(28,y-32,612,y-32,MIST);f.text(28,y,label,21);f.text(235,y,str(x),23);f.text(360,y,str(yv),23);f.text(470,y,winner,23,GREEN,bold=True)
    f.footer('Cosine: angle. IP: direction and magnitude. L2: separation.')
    return f


def quantization():
    f=Figure('Quantization replaces values with smaller codes','SQ maps individual coordinates to levels. PQ stores subvector codebook IDs. Residual quantization codes the remaining approximation error. Binary RaBitQ uses rotated directions with correction data. Payload sizes exclude index overhead and refinement.',1100)
    f.text(28,132,'SQ: round each coordinate to a level',22,bold=True)
    f.line(80,205,560,205,INK)
    for i in range(7):f.circle(80+i*80,205,5,fill=MIST)
    f.circle(363.2,176,7,fill=CORAL);f.line(363.2,176,400,205,arrow=True);f.circle(400,205,8,fill=TEAL)
    f.text(65,248,'Toy value 0.18 → level 0.33',20,MUTED)
    f.text(28,305,'PQ: one codebook ID per sub-vector',22,bold=True)
    for i,c in enumerate([TEAL,CORAL,GOLD,GREEN]):
        x=50+i*145;f.rect(x,330,122,34,fill=c);f.line(x+61,364,x+61,390,arrow=True);f.rect(x,398,122,48,fill=WARM);f.text(x+61,430,str([7,12,3,5][i]),25,anchor='middle',bold=True)
    f.text(28,490,'PRQ: code the error left by earlier stages',22,bold=True)
    f.text(40,532,'x = (0.8, 0.4)',21);f.text(340,532,'c1 = (0.6, 0.3)',21)
    f.line(295,528,330,528,arrow=True)
    f.text(40,573,'residual = x − c1 = (0.2, 0.1)',21,TEAL)
    f.text(40,608,'next code approximates that residual',20,MUTED)
    f.text(28,665,'RaBitQ: rotate direction, then encode signs',22,bold=True)
    for x in [125,335]:f.circle(x,730,43,fill=PAPER,stroke=MIST)
    f.line(125,730,157,706,arrow=True);f.line(335,730,311,698,arrow=True)
    f.line(184,730,272,730,arrow=True);f.line(386,730,460,730,arrow=True)
    f.text(480,738,'0 1',30,TEAL,bold=True)
    f.text(45,798,'Binary codes also need correction data.',20,MUTED)
    f.text(28,858,'768 dimensions: vector payload only',22,bold=True)
    values=[('FP32','3,072 B'),('SQ8','768 B'),('PQ 96 × 8 bits','96 B'),('1-bit codes','96 B')]
    for i,(a,b) in enumerate(values):
        x=28+(i%2)*310;y=900+(i//2)*54;f.text(x,y,a,20);f.text(x+195,y,b,22,TEAL,bold=True)
    f.footer('Toy mechanisms. Add graph, IDs, codebooks and refine data to the budget.')
    return f


def maxsim():
    f=Figure('MaxSim: take one maximum per query vector','Two query vectors and three document vectors yield a 2 by 3 matrix. MaxSim sums each query row maximum. Reversing query and document sums column maxima and gives a different score.',790)
    f.text(28,133,'Dot products of unit vectors',21,bold=True)
    for j in range(3):f.text(200+150*j,180,'d'+str(j+1),22,anchor='middle',bold=True)
    matrix=[[.8,.6,1.0],[.6,.8,0.0]]
    for i,row in enumerate(matrix):
        y=210+i*90;f.text(45,y+45,'q'+str(i+1),23,bold=True)
        for j,val in enumerate(row):
            maximum=(i==0 and j==2) or (i==1 and j==1);x=130+j*150;f.rect(x,y,140,75,fill=GOLD if maximum else WARM);f.text(x+70,y+48,f'{val:.1f}',28,anchor='middle',bold=maximum)
    f.text(28,447,'Query-row maxima: 1.0 + 0.8 = 1.8',23,TEAL,bold=True)
    f.text(28,500,'Reverse the roles:',22,bold=True)
    f.text(28,538,'Column maxima: 0.8 + 0.8 + 1.0 = 2.6',22)
    f.text(28,598,'q1=(1,0); q2=(0,1)',19,MUTED)
    f.text(28,631,'d1=(0.8,0.6); d2=(0.6,0.8); d3=(1,0)',19,MUTED)
    f.footer('MUVERA / token ANN find candidates; MaxSim scores the vector lists.')
    return f


def diskann():
    f=Figure('DiskANN separates routing codes from SSD data','A query compares compact PQ codes and cached nodes in RAM, selects node IDs to visit, and reads graph neighbors plus full vectors from SSD. Cache and I/O behavior affect latency.',810)
    f.circle(70,140,9,fill=CORAL);f.text(92,147,'query',23,CORAL);f.line(170,140,240,185,arrow=True)
    f.rect(28,180,584,205,fill=WARM);f.text(48,215,'RAM',23,bold=True)
    for i in range(6):
        x=60+i*87;f.rect(x,245,72,43,fill=GOLD if i in [1,4] else PAPER);f.text(x+36,273,str(i+1),22,anchor='middle')
    f.text(48,333,'Compact PQ codes + selected cached nodes',20)
    f.line(220,386,220,445,arrow=True);f.text(245,425,'visit selected IDs',20,TEAL)
    f.rect(28,456,584,228,fill=PAPER);f.text(48,490,'LOCAL SSD',23,bold=True)
    for i,x in enumerate([60,250,440]):
        f.rect(x,520,148,115,fill=WARM);f.circle(x+25,550,8,fill=TEAL);f.line(x+33,550,x+65,540);f.line(x+33,550,x+65,570);f.text(x+13,610,'graph + vector',17)
    f.line(577,456,577,386,arrow=True);f.text(48,658,'Fetch neighbors and full vectors as needed',19,MUTED)
    f.footer('Schematic residency, not a memory or latency benchmark.')
    return f


def cagra():
    f=Figure('CAGRA expands graph candidates in parallel','Several illustrative GPU work groups expand a candidate frontier using a graph resident on the GPU. Search width and candidate-pool size trade search effort for recall; GPU memory and utilization are separate constraints.',780)
    f.rect(28,148,584,430,fill=PAPER);f.text(48,183,'GPU: graph + vector representation',22,bold=True)
    nodes=[(405,295),(485,245),(545,335),(440,415),(530,465)]
    for i,j in [(0,1),(0,2),(0,3),(1,2),(2,3),(2,4),(3,4)]:f.line(*nodes[i],*nodes[j],MIST)
    for x,y in nodes:f.circle(x,y,11,fill=GOLD)
    for i in range(4):
        y=245+i*75;f.rect(48,y,210,44,fill=WARM);f.text(62,y+29,'work group '+str(i+1),20);f.line(258,y+22,*nodes[[0,1,3,4][i]],arrow=True)
    f.text(48,546,'Illustrative work groups; not a fixed thread layout',18,MUTED)
    f.text(28,627,'Search width + candidate pool → work / recall trade-off',20)
    f.footer('Benchmark transfer cost, batching, VRAM and realistic utilization.')
    return f


def compression_diagnosis():
    f=Figure('Coverage errors and scoring errors differ','If a true neighbor was never visited, refinement cannot recover it. If the neighbor is in the retrieved candidate pool but scored poorly, higher-precision reranking can improve its order. A recall plateau alone cannot distinguish them.',810)
    f.text(28,135,'1  Coverage miss: the item is absent',22,bold=True)
    f.rect(45,165,360,160,fill=PAPER,stroke=TEAL,dash=True)
    for x,y in [(100,210),(180,260),(280,205),(345,280)]:f.circle(x,y,10,fill=MIST)
    f.text(65,308,'visited candidate pool',20,TEAL)
    f.circle(510,225,13,fill=GOLD);f.text(455,268,'not visited',20)
    f.text(28,365,'Refinement cannot add the missing neighbor.',21,MUTED)
    f.text(28,430,'2  Scoring error: the item is in the pool',22,bold=True)
    f.rect(45,460,210,150,fill=PAPER,stroke=TEAL,dash=True)
    for x,y in [(95,500),(195,510),(110,570)]:f.circle(x,y,10,fill=MIST)
    f.circle(185,565,13,fill=GOLD)
    f.line(263,535,337,535,arrow=True)
    f.rect(350,460,240,150,fill=WARM);f.text(370,500,'Refine the shortlist',21,bold=True,width=19)
    f.text(370,560,'Reorder existing',20,width=20);f.text(370,588,'candidates',20)
    f.text(28,657,'Check exact ground truth, plain HNSW, then refine.',20)
    f.footer('A flat recall curve does not uniquely identify routing error.')
    return f


def bm25():
    f=Figure('Postings first, then BM25 scoring','An inverted list maps a term to matching document IDs. BM25 then combines inverse document frequency, saturating term frequency, and document-length normalization. The plotted term-frequency factor uses k1=1.2 and average document length.',840)
    f.text(28,132,'Query term: HNSW',23,bold=True)
    f.rect(40,160,155,64,fill=WARM);f.text(60,200,'HNSW',23,TEAL,bold=True)
    for i,x in enumerate([300,455]):f.rect(x,160,135,64,fill=WARM);f.text(x+16,200,'doc '+str([1,3][i]),22)
    f.line(195,192,290,192,arrow=True);f.line(435,192,445,192,arrow=True)
    f.text(28,275,'Repeated terms earn diminishing credit',22,bold=True)
    x0,y0=75,590;sx=44;sy=105
    f.line(x0,y0,560,y0,INK);f.line(x0,y0,x0,325,INK)
    f.text(90,335,'TF factor',19,MUTED)
    coords=[]
    for i in range(101):
        tf=i/10;v=tf*2.2/(tf+1.2);coords.append((x0+tf*sx,y0-v*sy+f.offset))
    f.parts.append('<polyline points="'+' '.join(f'{x:.2f},{y:.2f}' for x,y in coords)+f'" fill="none" stroke="{TEAL}" stroke-width="2"/>')
    for tf in [1,3,10]:
        v=tf*2.2/(tf+1.2);x=x0+tf*sx;y=y0-v*sy;f.circle(x,y,7,fill=CORAL);f.text(x-20,y-17,f'{v:.2f}',19)
    for tf in [0,5,10]:f.text(x0+tf*sx,620,str(tf),19,anchor='middle')
    f.text(140,662,'Occurrences of the query term',20)
    f.text(28,718,'IDF rewards rarity; b adjusts for document length.',20)
    f.footer('Curve = BM25 TF factor at average length, not a full relevance score.')
    return f


def range_band():
    f=Figure('A score band is not a complete census','For L2, a lower inclusive bound of 0.2 and upper exclusive radius of 0.7 admits distances in that band. ANN candidate coverage and the result limit are additional constraints. At limit 1 only the closest visited qualifying item is returned.',760)
    f.text(28,135,'L2: 0.2 ≤ distance < 0.7',23,bold=True)
    x=lambda d:70+500*d
    f.rect(x(.2),190,x(.7)-x(.2),90,fill=WARM,stroke=MIST)
    f.text(390,170,'not visited',18,MUTED)
    f.line(390,181,x(.6),222,MUTED,dash=True)
    f.line(70,235,570,235,INK)
    f.circle(x(.2),235,9,fill=TEAL);f.circle(x(.7),235,9,fill=PAPER,stroke=TEAL)
    for d in [0,.2,.45,.7,1]:f.text(x(d),320,str(d),19,anchor='middle')
    f.circle(x(.45),235,7,fill=TEAL);f.circle(x(.6),235,7,fill=PAPER,stroke=TEAL,dash=True)
    f.circle(x(.1),235,6,fill=MIST);f.circle(x(.85),235,6,fill=MIST)
    f.text(28,380,'Band membership',22,bold=True)
    f.text(28,416,'A score must satisfy both bounds.',20)
    f.text(28,476,'Candidate coverage',22,bold=True)
    f.text(28,512,'ANN can miss an item inside the band.',20)
    f.text(28,572,'Result cap: limit = 1',22,bold=True)
    f.text(28,608,'Return the closest visited qualifying item.',20)
    f.footer('COSINE / IP reverse score direction: radius < score ≤ range_filter.')
    return f

BUILDERS={'retrieval':retrieval,'hnsw':hnsw,'ivf':ivf,'ann-families':ann_families,'similarity-metrics':metrics,'quantization':quantization,'maxsim':maxsim,'diskann-tier':diskann,'cagra-parallel':cagra,'hnsw-recall-diagnosis':compression_diagnosis,'bm25-pipeline':bm25,'range-candidates':range_band}

def render_mechanisms(output):
    output=Path(output)
    for name,build in BUILDERS.items():(output/(name+'.svg')).write_text(build().finish())
    return list(BUILDERS)

if __name__=='__main__':
    print(render_mechanisms(Path(__file__).resolve().parents[1]/'public/images/ai-reference'))

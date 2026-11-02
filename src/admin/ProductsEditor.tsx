import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Content, StoredProduct } from '../data/catalog';
import { Field, FormHeader, ListRow, PhotoList, PriceField, TextArea, TextField, Thumb, Toggle, money, uniqueId, type EditorProps } from './fields';

const firstPhoto = (product: StoredProduct) => product.images[0] ?? product.aromas?.find(aroma => aroma.images.length)?.images[0];

export function ProductsEditor({ content, edit }: EditorProps) {
  const [openId, setOpenId] = useState<string>();
  const product = content.products.find(item => item.id === openId);
  if (product) return <ProductForm key={product.id} product={product} content={content} edit={edit} onBack={() => setOpenId(undefined)}/>;

  const create = () => {
    const id = uniqueId('novo-produto', content.products.map(item => item.id));
    edit(draft => { draft.products.push({ id, name: '', categoryId: draft.categories[0]?.id ?? '', images: [] }); });
    setOpenId(id);
  };
  return <section>
    <div className="section-head">
      <div><h2>Produtos</h2><p>Os produtos aparecem na vitrine, separados por categoria.</p></div>
      <button className="button primary" onClick={create}><Plus size={18}/>Novo produto</button>
    </div>
    {content.categories.map(category => {
      const items = content.products.filter(item => item.categoryId === category.id);
      return <div key={category.id} className="list-group">
        <h3>{category.name}</h3>
        {items.length ? <ul className="list">{items.map(item => {
          const aromas = item.aromas?.length;
          const details = [item.price !== undefined && money(item.price), aromas && `${aromas} ${aromas === 1 ? 'aroma' : 'aromas'}`].filter(Boolean).join(' · ');
          return <ListRow key={item.id} photo={firstPhoto(item)} title={item.name || 'Produto sem nome'} subtitle={details || undefined} badge={item.available === false ? 'Oculto' : undefined} onOpen={() => setOpenId(item.id)}/>;
        })}</ul> : <p className="empty">Nenhum produto nesta categoria. A vitrine mostra o aviso de fotos em breve.</p>}
      </div>;
    })}
    {content.products.some(item => !content.categories.some(category => category.id === item.categoryId)) && <div className="list-group">
      <h3>Sem categoria</h3>
      <ul className="list">{content.products.filter(item => !content.categories.some(category => category.id === item.categoryId)).map(item => <ListRow key={item.id} photo={firstPhoto(item)} title={item.name || 'Produto sem nome'} badge="Não aparece" onOpen={() => setOpenId(item.id)}/>)}</ul>
    </div>}
  </section>;
}

function ProductForm({ product, content, edit, onBack }: { product: StoredProduct; content: Content; edit: EditorProps['edit']; onBack: () => void }) {
  const change = (fn: (item: StoredProduct) => void) => edit(draft => fn(draft.products.find(item => item.id === product.id)!));
  const remove = () => {
    if (!confirm(`Excluir o produto "${product.name || 'sem nome'}"?`)) return;
    edit(draft => { draft.products = draft.products.filter(item => item.id !== product.id); });
    onBack();
  };
  const selected = new Set(product.aromas?.map(aroma => aroma.id));
  const toggleAroma = (id: string) => change(item => {
    const aromas = item.aromas ?? [];
    if (selected.has(id)) item.aromas = aromas.filter(aroma => aroma.id !== id);
    // Mantém a ordem da lista geral de aromas.
    else item.aromas = content.aromas.flatMap(aroma => aroma.id === id ? [{ id, images: [] }] : aromas.filter(own => own.id === aroma.id));
    if (!item.aromas.length) delete item.aromas;
  });
  const aromaName = (id: string) => content.aromas.find(aroma => aroma.id === id)?.name ?? id;

  return <section className="form">
    <FormHeader title={product.name || 'Novo produto'} onBack={onBack} onDelete={remove}/>
    <div className="card">
      <TextField label="Nome" required value={product.name} onChange={value => change(item => { item.name = value ?? ''; })}/>
      <Field label="Categoria">{id => <select id={id} value={product.categoryId} onChange={event => change(item => { item.categoryId = event.target.value; })}>
        {!content.categories.some(category => category.id === product.categoryId) && <option value={product.categoryId}>Escolha uma categoria</option>}
        {content.categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>}</Field>
      <TextArea label="Descrição" value={product.description} onChange={value => change(item => { item.description = value; })}/>
      <div className="field-row">
        <PriceField value={product.price} onChange={value => change(item => { item.price = value; })}/>
        <TextField label="Tamanho ou medida" placeholder="Ex.: 250 ml" value={product.size} onChange={value => change(item => { item.size = value; })}/>
      </div>
      <Toggle label="Mostrar na vitrine" checked={product.available !== false} onChange={checked => change(item => { if (checked) delete item.available; else item.available = false; })}/>
    </div>

    <div className="card">
      <h3>Fotos do produto</h3>
      <p className="card-hint">{product.aromas?.length ? 'Produtos com aromas mostram a foto de cada aroma. Estas fotos aparecem quando o aroma escolhido não tem foto própria.' : 'A primeira foto é a capa na vitrine.'}</p>
      <PhotoList photos={product.images} name={product.name} onChange={images => change(item => { item.images = images; })}/>
    </div>

    <div className="card">
      <h3>Aromas</h3>
      <p className="card-hint">Marque os aromas em que este produto é vendido. Cada aroma pode ter foto e preço próprios.</p>
      <div className="chips">{content.aromas.map(aroma => <button key={aroma.id} type="button" className="chip" aria-pressed={selected.has(aroma.id)} onClick={() => toggleAroma(aroma.id)}>{aroma.name}</button>)}</div>
      {!product.aromas?.length && <TextField label="Aroma (texto livre)" hint="Use quando o produto não é vendido nos aromas da lista." value={product.fragrance} onChange={value => change(item => { item.fragrance = value; })}/>}
      {product.aromas && product.aromas.length > 0 && <ul className="aroma-variants">
        {product.aromas.map(variant => {
          const changeVariant = (fn: (v: NonNullable<StoredProduct['aromas']>[number]) => void) => change(item => fn(item.aromas!.find(own => own.id === variant.id)!));
          const name = aromaName(variant.id);
          return <li key={variant.id}><details>
            <summary>
              <Thumb photo={variant.images[0]}/>
              <span className="list-text"><strong>{name}</strong><small>{[variant.images.length ? `${variant.images.length} ${variant.images.length === 1 ? 'foto' : 'fotos'}` : 'Sem foto', variant.price !== undefined && money(variant.price), variant.available === false && 'Esgotado'].filter(Boolean).join(' · ')}</small></span>
            </summary>
            <div className="variant-body">
              <PhotoList photos={variant.images} name={`${product.name} ${name}`} onChange={images => changeVariant(v => { v.images = images; })}/>
              <PriceField label="Preço deste aroma" hint="Vazio usa o preço do produto." value={variant.price} onChange={value => changeVariant(v => { v.price = value; })}/>
              <Toggle label="Disponível" checked={variant.available !== false} onChange={checked => changeVariant(v => { if (checked) delete v.available; else v.available = false; })}/>
            </div>
          </details></li>;
        })}
      </ul>}
    </div>
  </section>;
}

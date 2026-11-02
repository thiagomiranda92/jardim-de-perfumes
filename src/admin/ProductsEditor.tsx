import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Content, StoredProduct } from '../data/catalog';
import { Field, FormHeader, ListRow, PhotoList, PriceField, TextArea, TextField, Thumb, Toggle, isGlassSize, money, uniqueId, type EditorProps } from './fields';

const firstPhoto = (product: StoredProduct) => product.images[0] ?? product.variants?.find(variant => variant.images.length)?.images[0] ?? product.aromas?.find(aroma => aroma.images.length)?.images[0];

// Um tamanho "Vidro" não tem medida fixa: ao escolhê-lo, pede os ml e guarda "Vidro · 350 ml".
function SizePicker({ sizes, value, onChange, label = 'Tamanho', emptyLabel = 'Sem tamanho' }: { sizes: string[]; value?: string; onChange: (value: string | undefined) => void; label?: string; emptyLabel?: string }) {
  const glassSize = sizes.find(size => value === size || value?.startsWith(`${size} · `));
  const glass = glassSize && isGlassSize(glassSize) ? glassSize : undefined;
  const ml = glass && value !== glass ? value!.slice(glass.length + 3).replace(/\s*ml$/, '') : undefined;
  const chosen = glassSize ?? value ?? '';
  if (!sizes.length) return <TextField label={label === 'Tamanho' ? 'Tamanho ou medida' : label} placeholder="Ex.: 250 ml" hint="Esta categoria não tem tamanho padrão." value={value} onChange={onChange}/>;
  return <>
    <Field label={label} hint="Opções definidas na categoria, em Categorias.">{id => <select id={id} value={chosen} onChange={event => onChange(event.target.value || undefined)}>
      <option value="">{emptyLabel}</option>
      {sizes.map(size => <option key={size}>{size}</option>)}
      {value && !sizes.includes(chosen) && <option value={value}>{value} (fora da lista)</option>}
    </select>}</Field>
    {glass && <Field label="Quantos ml? *" hint={`Aparece no site como “${glass} · 350 ml”.`}>{id => <div className="price-input"><input id={id} inputMode="decimal" placeholder="Ex.: 350" value={ml ?? ''} onChange={event => {
      const digits = event.target.value.replace(/[^\d,.]/g, '');
      onChange(digits ? `${glass} · ${digits} ml` : glass);
    }}/><span className="unit">ml</span></div>}</Field>}
  </>;
}

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
          const variants = item.variants?.length;
          const details = [item.price !== undefined && money(item.price), aromas && `${aromas} ${aromas === 1 ? 'aroma' : 'aromas'}`, variants && `${variants} ${variants === 1 ? 'tamanho' : 'tamanhos'}`].filter(Boolean).join(' · ');
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
  const sizes = content.categories.find(category => category.id === product.categoryId)?.sizes ?? [];
  const variants = product.variants ?? [];
  type StoredVariant = NonNullable<StoredProduct['variants']>[number];
  const changeVariant = (index: number, fn: (variant: StoredVariant) => void) => change(item => fn(item.variants![index]));
  const addVariant = () => change(item => {
    const used = (item.variants ?? []).map(variant => variant.size);
    // O primeiro tamanho novo aproveita o tamanho que o produto já tinha.
    const size = item.variants?.length ? sizes.find(option => !used.includes(option)) ?? '' : item.size ?? sizes[0] ?? '';
    item.variants = [...(item.variants ?? []), { size, images: [] }];
    delete item.size;
  });
  const removeVariant = (index: number) => change(item => {
    item.variants!.splice(index, 1);
    if (!item.variants!.length) delete item.variants;
  });

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
        <PriceField label={variants.length ? 'Preço padrão' : 'Preço'} hint={variants.length ? 'Usado nos tamanhos sem preço próprio.' : undefined} value={product.price} onChange={value => change(item => { item.price = value; })}/>
        {!variants.length && <div><SizePicker sizes={sizes} value={product.size} onChange={value => change(item => { item.size = value; })}/></div>}
      </div>
      <Toggle label="Mostrar na vitrine" checked={product.available !== false} onChange={checked => change(item => { if (checked) delete item.available; else item.available = false; })}/>
    </div>

    <div className="card">
      <h3>Fotos do produto</h3>
      <p className="card-hint">{product.aromas?.length ? 'Produtos com aromas mostram a foto de cada aroma. Estas fotos aparecem quando o aroma escolhido não tem foto própria.' : 'A primeira foto é a capa na vitrine.'}</p>
      <PhotoList photos={product.images} name={product.name} onChange={images => change(item => { item.images = images; })}/>
    </div>

    <div className="card">
      <h3>Tamanhos</h3>
      <p className="card-hint">{variants.length ? 'No site, o cliente escolhe o tamanho e a foto e o preço mudam. Sem foto ou preço, valem os do produto.' : 'Cadastre aqui quando este produto é vendido em mais de um tamanho, cada um com foto e preço próprios.'}</p>
      {variants.length > 0 && <ul className="aroma-variants">
        {variants.map((variant, index) => <li key={index}><details open={!variant.size}>
          <summary>
            <Thumb photo={variant.images[0]}/>
            <span className="list-text"><strong>{variant.size || 'Tamanho sem nome'}</strong><small>{[variant.images.length ? `${variant.images.length} ${variant.images.length === 1 ? 'foto' : 'fotos'}` : 'Sem foto', variant.price !== undefined && money(variant.price), variant.available === false && 'Esgotado'].filter(Boolean).join(' · ')}</small></span>
          </summary>
          <div className="variant-body">
            <SizePicker sizes={sizes} label="Tamanho *" emptyLabel="Escolha o tamanho" value={variant.size || undefined} onChange={value => changeVariant(index, v => { v.size = value ?? ''; })}/>
            <PhotoList photos={variant.images} name={`${product.name} ${variant.size}`} onChange={images => changeVariant(index, v => { v.images = images; })}/>
            <PriceField label="Preço deste tamanho" hint="Vazio usa o preço padrão do produto." value={variant.price} onChange={value => changeVariant(index, v => { v.price = value; })}/>
            <Toggle label="Disponível" checked={variant.available !== false} onChange={checked => changeVariant(index, v => { if (checked) delete v.available; else v.available = false; })}/>
            <button type="button" className="mini-button danger with-text" onClick={() => removeVariant(index)}><Trash2 size={15}/>Remover tamanho</button>
          </div>
        </details></li>)}
      </ul>}
      <button type="button" className="upload-button" onClick={addVariant}><Plus size={18}/>{variants.length ? 'Adicionar outro tamanho' : 'Adicionar tamanho'}</button>
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

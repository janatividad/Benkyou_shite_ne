'use client';
import { useEffect, useState } from 'react';

const scenes = [
 {label:'At the clinic',icon:'＋',jp:'いつからこの症状がありますか？保険証をお持ちですか？',en:'When did these symptoms start? Do you have your health insurance card?',romaji:'Itsu kara kono shōjō ga arimasu ka? Hokenshō o omochi desu ka?',phrase:'保険証を持っています',phraseR:'Hokenshō o motte imasu',meaning:'I have my health insurance card.',context:'Japanese clinics usually ask for your insurance card before the consultation.'},
 {label:'City hall',icon:'〒',jp:'こちらの用紙に住所と在留カード番号をご記入ください。',en:'Please write your address and residence card number on this form.',romaji:'Kochira no yōshi ni jūsho to zairyū kādo bangō o gokinyū kudasai.',phrase:'どこに書けばいいですか？',phraseR:'Doko ni kakeba ii desu ka?',meaning:'Where should I write it?',context:'ご記入ください is a polite, formal phrase commonly used on official forms.'},
 {label:'Restaurant',icon:'箸',jp:'こちらは卵が入っていますが、アレルギーは大丈夫ですか？',en:'This contains egg. Is that okay with your allergies?',romaji:'Kochira wa tamago ga haitte imasu ga, arerugī wa daijōbu desu ka?',phrase:'卵は食べられません',phraseR:'Tamago wa taberaremasen',meaning:'I cannot eat eggs.',context:'食べられません clearly communicates a dietary restriction, not merely a preference.'}
];
declare global { interface Window { webkitSpeechRecognition?: new () => any } }

export default function Home(){
 const [selected,setSelected]=useState(1), [input,setInput]=useState(scenes[1].jp), [show,setShow]=useState(true), [loading,setLoading]=useState(false), [listening,setListening]=useState(false), [saved,setSaved]=useState(3), [now,setNow]=useState('');
 const active=scenes[selected];
 useEffect(()=>{const tick=()=>setNow(new Intl.DateTimeFormat('en',{hour:'2-digit',minute:'2-digit'}).format(new Date()));tick();const t=setInterval(tick,30000);return()=>clearInterval(t)},[]);
 function choose(i:number){setSelected(i);setInput(scenes[i].jp);setShow(true)}
 function translate(){if(!input.trim())return;setShow(false);setLoading(true);setTimeout(()=>{setLoading(false);setShow(true)},650)}
 function listen(){const R=window.webkitSpeechRecognition;if(!R){setListening(true);setTimeout(()=>{setInput(active.jp);setListening(false);translate()},1500);return}const r=new R();r.lang='ja-JP';r.interimResults=true;r.onresult=(e:any)=>setInput(e.results[e.results.length-1][0].transcript);r.onend=()=>setListening(false);r.onerror=()=>setListening(false);r.start();setListening(true)}
 return <main>
  <nav><div className="brand"><span className="brandMark">日</span><span>Nihongo <b>Lens</b></span><em>LIVE</em></div><div className="navRight"><span className="dot"/>Tokyo · {now}<button className="saved">Phrasebook <strong>{saved}</strong></button></div></nav>
  <section className="hero"><div className="eyebrow">REAL-TIME LANGUAGE COMPANION</div><h1>Understand Japan.<br/><i>Learn as you live.</i></h1><p>Instant translation with the context and Japanese you’ll need next time.</p></section>
  <section className="workspace"><div className="scenarioBar"><span>TRY A REAL-LIFE MOMENT</span><div>{scenes.map((s,i)=><button key={s.label} onClick={()=>choose(i)} className={selected===i?'active':''}><b>{s.icon}</b>{s.label}</button>)}</div></div>
   <div className="panels"><article className="inputPanel"><header><div><span>日本語</span><small>Japanese input</small></div><span className="secure">● ON-DEVICE AUDIO</span></header><textarea aria-label="Japanese to translate" value={input} onChange={e=>setInput(e.target.value)} placeholder="Speak or type Japanese…"/><div className="reading">{show?active.romaji:'Listening for Japanese…'}</div><footer><button className={`mic ${listening?'recording':''}`} onClick={listen}><span>{listening?'■':'●'}</span>{listening?'Listening…':'Speak Japanese'}</button><button className="translate" onClick={translate}>Translate <span>→</span></button></footer></article>
   <article className="outputPanel"><header><div><span>EN</span><small>Natural English</small></div><span className="powered">POWERED BY <b>SHISA.AI</b></span></header>{loading?<div className="thinking"><span/><span/><span/> Understanding context…</div>:show&&<><p className="translationText">{active.en}</p><div className="context"><span>◎</span><div><b>Good to know</b><p>{active.context}</p></div></div></>}</article></div>
   {show&&!loading&&<aside className="learnCard"><div className="learnLabel"><span>今日の日本語</span><small>LEARN FROM THIS MOMENT</small></div><div className="phrase"><strong>{active.phrase}</strong><span>{active.phraseR}</span></div><p>{active.meaning}</p><button onClick={()=>setSaved(saved+1)}>＋ Save phrase</button></aside>}
  </section><footer className="pageFooter"><span>Built for life in Japan</span><span>Translation gets you through today. Learning helps you belong tomorrow.</span></footer>
 </main>
}

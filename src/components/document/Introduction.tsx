import React, { useState } from "react";

import style from "../../styles/module/introduction.module.scss";
import EditIcon from "../../../public/icon/edit.svg";
import { useRouter } from "next/router";
import {
  useDocumentQuery,
  useGetUserDocumentQuery,
  useGetUserFromScheduleQuery,
  useUpdateDocumentMutation,
} from "../../generated/graphql";

interface IntroductionProps {}

interface InfoContainerProps {
  size: string;
  content: string;
  position?: boolean;
  type?: string;
  id?: number;
  scheduleId?: number;
  transcriptId?: number;
}

const InfoContainer: React.FC<InfoContainerProps> = ({
  children,
  size,
  content,
  type,
  id,
  scheduleId,
  transcriptId,
}) => {
  const [text, setText] = useState(content);
  const [edit, setEdit] = useState(false);
  const [, update] = useUpdateDocumentMutation();

  return (
    <div className={style.edit}>
      {!edit ? (
        <div> {text === "" ? "chưa có" : text}</div>
      ) : (
        <form
          className={style.form}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            autoComplete="off"
            type={
              type
                ? type === "title" ||
                  type === "company" ||
                  type === "description" ||
                  type === "transcript"
                  ? "text"
                  : "time"
                : null
            }
            name="time"
            onChange={({ target: { value } }) => setText(value)}
            placeholder="Chỉnh sửa"
            value={text}
          />
        </form>
      )}

      {type ? (
        <>
          {!edit ? (
            <div style={{ width: size }} className={`${style.icon}`}>
              <EditIcon
                onClick={() => setEdit(true)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                console.log(type);
                if (type === "title") {
                  update({
                    options: {
                      id,
                      title: text,
                    },
                  });
                } else if (type === "company") {
                  update({
                    options: {
                      id,
                      scheduleId,
                      company: text,
                    },
                  });
                } else if (type === "description") {
                  update({
                    options: {
                      id,
                      scheduleId,
                      description: text,
                    },
                  });
                } else if (type === "transcript") {
                  update({
                    options: {
                      id,
                      transcripts: {
                        id: transcriptId,
                        context: text,
                      },
                    },
                  });
                }
                setEdit(false);
              }}
              className={style.button}
            >
              Nhập
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

const millisecondToTime = (input: number) => {
  const time = input / 1000;
  let hours = Math.floor(time / (60 * 60));

  let divisor_for_minutes = time % (60 * 60);
  let minutes = Math.floor(divisor_for_minutes / 60);

  let divisor_for_seconds = divisor_for_minutes % 60;
  let seconds = Math.ceil(divisor_for_seconds);

  // setTimeout(() => {
  //   setTime(() => meetingStatedTime.valueOf() - new Date().valueOf());
  // }, 1000);

  return `${hours} giờ ${minutes} phút ${seconds} giây`;
};

const Introduction: React.FC<IntroductionProps> = ({}) => {
  const router = useRouter();

  const [{ data }] = useDocumentQuery({
    variables: {
      id: parseInt(router.query.id as string),
    },
  });

  const [users] = useGetUserDocumentQuery({
    variables: {
      options: {
        absents: data?.document?.document?.absents
          .split("-")
          .map((value) => parseInt(value))
          .filter((value) => !isNaN(value)),
        members: data?.document?.document?.members
          .split("-")
          .map((value) => parseInt(value))
          .filter((value) => !isNaN(value)),
      },
    },
  });

  const renderTime = (time: string) => {
    if (time.length === 1) return "0" + time;
    return time;
  };

  if (!data?.document?.document) return <div></div>;

  return (
    <div className={style.container}>
      <div className={style.left}>
        <div className={style.title}>
          <InfoContainer
            size="4rem"
            content={data.document.document.title}
            type="title"
            id={data.document.document.id}
            scheduleId={data.document.document?.schedule?.id}
          />
        </div>
        <ul className={style.list_description}>
          <li className={style.description}>
            <div className={style.description_title}>{"Ngày họp" + ": "}</div>
            <div className={style.description_content}>
              <InfoContainer
                size="2rem"
                content={data.document.document.createdAt.substring(0, 10)}
                position={true}
                id={data.document.document.id}
                scheduleId={data.document.document?.schedule?.id}
              />
            </div>
          </li>
          <li className={style.description}>
            <div className={style.description_title}>
              {"Quãng thời gian họp" + ": "}
            </div>
            <div className={style.description_content}>
              <InfoContainer
                size="2rem"
                content={millisecondToTime(data.document.document.duration)}
                position={true}
                id={data.document.document.id}
                scheduleId={data.document.document?.schedule?.id}
              />
            </div>
          </li>
          <li className={style.description}>
            <div className={style.description_title}>
              {"Thời gian họp của lịch họp" + ": "}
            </div>
            <div className={style.description_content}>
              <InfoContainer
                size="2rem"
                content={data.document.document.schedule.startAt + ":00"}
                position={true}
                id={data.document.document.id}
                scheduleId={data.document.document?.schedule?.id}
              />
            </div>
          </li>
          <li className={style.description}>
            <div className={style.description_title}>{"Giờ họp" + ": "}</div>
            <div className={style.description_content}>
              <InfoContainer
                size="2rem"
                content={`${renderTime(
                  data.document.document.startedAt.split(" ")[0]
                )}:${renderTime(
                  data.document.document.startedAt.split(" ")[1]
                )}:${renderTime(
                  data.document.document.startedAt.split(" ")[2]
                )}`}
                position={true}
                id={data.document.document.id}
                scheduleId={data.document.document?.schedule?.id}
              />
            </div>
          </li>
          <li className={style.description}>
            <div className={style.description_title}>{"Tổ chức" + ": "}</div>
            <div className={style.description_content}>
              <InfoContainer
                size="2rem"
                content={data.document.document.schedule.company}
                position={true}
                type="company"
                id={data.document.document.id}
                scheduleId={data.document.document?.schedule?.id}
              />
            </div>
          </li>

          <li className={style.description}>
            <div className={style.description_title}>{"Mô tả" + ": "}</div>
            <div className={style.description_content}>
              <InfoContainer
                size="2rem"
                content={data.document.document.schedule.description}
                position={true}
                type="description"
                id={data.document.document.id}
                scheduleId={data.document.document?.schedule?.id}
              />
            </div>
          </li>
        </ul>
        {/* <div className={style.objective}>
          <div className={style.objective_title}>Mục tiêu: </div>
          <div className={style.objective_content}>
            <InfoContainer size="2rem" content={""} position={true} />
          </div>
        </div> */}
      </div>
      <div className={style.right}>
        <div className={style.logo}>
          {/* <img className={style.logo} src={data.document.schedule.banner} /> */}
        </div>
        <div className={style.attend}>
          <div className={style.attend_title}>Người tham dự</div>
          <ul
            className={style.list_attendee}
            style={{
              gridTemplateColumns:
                data.document.users.length === 1
                  ? "1fr"
                  : data.document.users.length <= 4
                  ? "1fr 1fr"
                  : "1fr 1fr 1fr",
            }}
          >
            {users.data?.getUserDocument.map(
              (
                { user: { id, username, avatar, fullname }, isAbsent },
                index
              ) => {
                return (
                  <li className={style.attendee} key={index}>
                    <div
                      style={{
                        backgroundImage: `url(${avatar})`,
                        opacity: isAbsent ? 0.4 : 1,
                      }}
                      className={style.avatar}
                    ></div>
                    {isAbsent ? <div className={style.absent}>Vắng</div> : null}
                    <div className={style.attendee_info}>
                      <div className={style.attendee_info_username}>
                        {fullname}
                      </div>
                      <div className={style.attendee_info_job}>
                        {"@" + username}
                      </div>
                    </div>
                  </li>
                );
              }
            )}
            {/* <li key={"lol"} className={style.more}>
              28
              <div>+</div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Introduction;

const list_attendees = [
  {
    username: "dat hoang",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixid=mxwxmja3fdb8mhxzzwfyy2h8mxx8cg9ydhjhaxr8zw58mhx8mhw%3d&ixlib=rb-1.2.1&w=1000&q=80",
    role: "host",
    job: "marketing leader",
  },
  {
    username: "binh nguyen",
    avatar:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixid=mxwxmja3fdb8mhxzzwfyy2h8mnx8cg9ydhjhaxr8zw58mhx8mhw%3d&ixlib=rb-1.2.1&w=1000&q=80",
    job: "assistance",
  },
  {
    username: "tran hoang huy",
    avatar:
      "data:image/jpeg;base64,/9j/4aaqskzjrgabaqaaaqabaad/2wceaakgbxitehutehivfruvfxcvfhyxfruvfhcwfruwfxcvfrcyhsgggbolhrcvitehjskrli4ufx8zodmtnygtlisbcgokdg0ndw0pdyszfrkrkysrkysrlssrkzc3kys3ky03ky03ny0rltctkzcrkysrls0rky0tkystnysrkysrk//aabeiap8axgmbigaceqedeqh/xaacaaabbqebaqaaaaaaaaaaaaacaqmebqyabwj/xaa8eaabawieaggebqigaweaaaabaairayeeejfbbvegeyjhcygr8dkhscehqthh8rqjumjygqkyfvodm//eabybaqebaaaaaaaaaaaaaaaaaaabav/eabyraqebaaaaaaaaaaaaaaaaaaabef/aaawdaqaceqmrad8a3yalhkalhamjcqijyqigog1kam8zvdkbnh8rsfqimv+ihsumacpsjzyc8ggqjjloxjjyxm7qsdetj8jtn/f6py3euq1alu3g5rm3amw8fa9f8e+salgwtb8v82a4tfhusqq8rhrnau514galsonwapcmcrhcdqtbbjbvj7p7vmvrk/a2mas2zgajignw+uyo8zg6d5it5ab/acqyvhtblqbczaterhfordmoratyu2nkssqdpecp0b8lo8fwdhpxwut5nsefgod+btglstj7zeof6imzua6t3cyb/jsopeef8q2xfch3obty76xcapclg8+scsrnyrr3dbstjtlph7r581dmvjaqrbotx+pg67arccoizskgpbud3xouryerfrqrq0i10oeippvg3e6ekotrujlhib2io4i5hsy1esfg1xoiq7dopzcc9mvxbj0uvxyeqywpc1okiyvdwviwp2ekkbktxjwhcgehkauarqgqbeauarbfcas9+idy3a1y3ab6kt8lowfi/wav6syzjqsm1qcbvaj+ydzdd1hllmpikafm+ew8l6j0i4s2lqkcosoyzywdcffy3oztyarmoptvj/lfqjca7r09kninowwqr+k8mbuarmimdqnb6rgccwoq3ewiern+vv3xuqpjuhzg2uzvti/zb53xqntv+snzuz72s8qw5atbn6kntqnqjx5bkcv4huk22ukk4qfjkv+fmqoynz28uuxvazv4j1vhgmixcymdw71elczle4kzqo7b3oigf6appa8b/h7qn45w0hvmt0/raz1sxftexvzmlbm+hejnlguhzso6xrse5xh2q+kf80y9hbukwywz7wbh6l6e6my3rslrqrgzg3m8qbqwwbcqoyhkqbhiusrabxjsuudwswlasgiroralgeqcdmhyn8wac4anyez73i8gfuafmvxfwxwymn/1ua/ybgx5fbjeiwclaoe8y7lo9pjc+xctwapbgxpss7wkqifgdtao8fxyule+5qsnptr78lx8sqdnl6d3y1ugu7on1luhfk3zj/fnbyvfjxoct4lufqdx3rzt8vxztf8arqxdygalmybghvkcylofiojwhwgmtcngwkr6kmfyzof081jbj/mfmgkucufny57yhvn/achyyqvxf8mbjgx+y9m/d9wpd6ed8l/gtk8ox4bpumad7r17orqy4hdii/tgnzsc4cebcdcgivqcrekhuavyurkeieocubeaopaeyc4beagsqlmwgqqcbxoyynxwzkol8hbzcpe6oyugktvom+nmjfs4dialmlr205arszf15tw5mixndd47maeiaxtzvzalspi7q0vbegxgolrghpvkgzmetcnw5tvsrajidabbekhcmw78z3vmueoa9+x4c5kmbyurbctbsr5qcvrpzhos9xkgjcl9140m3vkrxjnfuoz2ms6gvlg9jmzj1rydvakdyoqk2hadbsp19hr6jffjzuvgcvovhglbaqmiw5bfqrcwdz+qflfksmwaknuyajqqupt9kha0ph4qm0y4+huz/smk3rpqt8trouki1hjvun3hnvxdi2g7zy9wrjbephenffmgbp4j1qmpteuqpawt3/et3aanyxoremuczwgfa5zi0im57wzta7sc6b31ibheccazau2sqopkhxznmgcmpejmcr5qu4th3f1mcoum5w1kzhe7ljhgu8obkqe/ocehopqfuaqhkmosgarkpxkolnralmhlcypqeycqbgagh8a4amrh6ta6vgoz4eix9yxjvxpcmfspyq0w/qgaoekhrd2nx/ujxu7avnl8scc+nxcq4tor7yqrfxhvmg9g6ovxvznazaqcdvb0br4zeboc3rq+g0f00jdxgbgds+vw5sol4bzzzbnejy1sqssdantbu81kuj8sycza4h/s4h6lb4lo0wpnsq5+uezmspxjqtc49qij0iywf6ddgmiqx2cpio17s0tdyybbk7np58rom3hsbrjajcdov8rqug0slrpbuppzw6i2nra3iaoabvnopigsted7qz0nololxdpstf3yj0qqhpideymyrilmnxraprwnsdhla5oim0fzhh8lhxaj1vuyqqcbig489lfo05dayxhyfsrfo9g6rq5arsouoqzbznclm4rwaq7etpjcnyszrhpzmzdsc9zahmqytbm8aikg13u4d6bma6slhwwr4himbn+z8sm+lha8pny4z5ermydmpzf4z+gi21nukgyhh5poasd4albp6zvcgpuiboah+arc9w+avpwyw3x1qmiqnm6g3kwny1ropkgef7iqtpqxzm0mmbmjdidlazl3w4/bbh/v4ws/d9qcduw3qegyon+5nloucahunlcuzqlabxjseqilgigeyaidvfcajasgiwehncyvhoehukgia+jpbewzarpvmfrwhdick2o3k8sd3kehmclgopmec8lq4erunrzctz2zjzmt1lpnbt5q+ppaqzuut0fp9z139rihfklrhoywzbiexmivzwxxolyujvqwekc2dcecw/h6tb5j8itdxdeyig6qaeekkumjl+qdj4pgl6rsz7nb30xphbue0+raai5ncws/i8s0hklawc2/aajnmecwjf5+cdn9nco0vkrfhyeizhfqbukaray2f4huxmp9wwrxcoinvh+acj4rwmt1lgx1ibupdorzlzve6/yr2hiikdywqjrydpubb7v0qochwovsumk+7lo4mma4asorcsgc59upby7eyhrbq5zwj/cyla5xjxq1uqpdp5akqalkk3mdxf5l2xo7woyxduqa/i3td7jdx9spud4vqo//ajuabcds1jwl3muieknmu+5a0u2qnnbnkkhohiqjisqgaispxbcgsg1ego2trzvaicmnshqgrxyz4naejqgaiawdxvtpdmmcxry0tge6f4vxhwc07w1qawbeu9jmjlr1g8ngpamqqtpt+ifvuka1lqtp7gcjurcpjhvmb7zmcsqtbbtwtlqawr3pms0hp966p2i+0hafnzheseae43qyq03vk9olmz3tatydnqt6svv6dpdui12ckmbabnpt9llqnr0b5cdcac8wshom981bihh+7cxld5bful0uxwqvl4ghl9aqgtimo9gpult9eu6oop0azipyhhsfpduj+b1kjgotag9iy57hqsui0kbxnngoxnr/py/bzrkknm/vkfyylhfkizkjctq52p/rrme2prbnsbvjk2h4v4qhgu3oohje8w10dxlzgo2xr4x+6m1mw6hsy5ji15qihawqq1xhzaqfsl2ppzv4bw78wszsaa8nrdm7su9qtv0y/flc4ns1f7l5jtfcfbydbucahhtqscja4edxcutqmejce4qhivdrc5e4jufq1qpepdkmnhwy94j5a3wp430zqvbdow11rfee4la8fwnwswnmz1gfqncqdy8x/ff73tp4cbuewdqqbfcvdwzmpvc4sdln7gwngpfetcq9jojilsr4hdbhotxbli4ydvvccrxqpvazfawf4jfvdvrmpxsno6tlp1kyz0hwvs8z8o4ducy+a84pouadefjtquq4pvwhn2xbwwmx4l13cnbppa1j6wediqpk0lydcsy4lkcxhmf7bhjleaf+kgi/+bop/ckinsrx87/zangxabpcsg4q7zwhwdakr2gfjqjxdicgxryfe1yzsnjb3/xuwd4jxysyuaygagb2ndmrph8vxlamhvpvwutmtedy3yygicz63rpfpxaw996br4aq09k+u/bdrknehlffqsdajjayvou9lsiuxekbz3hcsfmg1dce6yci8dlcxtqke8ltng4pvzdtda8uasb37qduxwczky9wghpqr5ln8eqxtojfoxfl90y12z/ce10kfekoun5gfzbx4l0tgx+rryvo2dfdbx1pf+kqix0fboqxgk1eau6zx4pihotj0a6b8qpkf1uvp/4agbnwiusbueyveu+3itg0dkaprb9h8b6z4tembnvlopo6m5wbb7p1c0dhtddpbhmgv8ngstedeasoe9icth3a0qzm92awnxabipqbwslyzgh4sgtjfmhwhxnbiplqfyoy4401gkkl0rlilxvagnkhpsygggb30/dyz9qmjkkyavcgb4nvl6jnkazjmbp8d4gatxyt9xdtqaffhv7qoq0y0wvr6puqiptpmhed4ulle5vilahghecrlpgoxsqmbvbg4+ikefggl8trh+ds+ap6l1pjeinpjxvfj3ba3pogv/pobxaf5nwfeinwy87h62lewsy1arorxn+ohurmc4ahwozpvbcg8j5fwohr9mxsvjegy00xuwdy2af7lju3zs9yu8dxyolxdsntucojjmt63poqrnbcaaozbqgj7j1+aomdgjmgxn/yvtisbwmlkemwgvok4mmxq4nccrh3vzw4vsp2a0t6n5e7rnyravg658tmj+si1mfvijjba1m2qwpfok9ybmw297qtfxkaiw4axjci5bnwmyb3dfz+3z9vwcurzqttg29nvnxgiynppb9vturlihquqjfpveyrcnhomo5asukjjvug0webcurygudjai5cuqe8hihjc0oefhw7eepg5mnva8qwpwnjagtajmtrczqkukpft1cxkqj180xudcvxu3zunlz8cch02p3bhrcvudr7xsd+ih1a5lcu0ygyxpxqrimalkns3evnvfdescadwnilrromxcutznbz7lt/ruxb+pyorq/eltv/actq+ohshqsj0s4qwunzgt+anu/1+ouvsmbxdrm5s64nu6+hvkoveoilk5spdybeeu8a8bmykniriicse+ymjgu63gc51pi3i6rqmle43mdklear6mmmyj84qzyduflvxkjk39hdj1gantv3urjocyxfeua4qsxfdscat4+yqbqfnoqhqgkgmbooktqicvfisucrkqggqusnc5qx3e6abredz8cqahacsc1b7d2xh+krpqguq5igl4evbeo8xskahqgvlw9xy6kvunsmduyvae9n1qchuuqnhtka6nzpkn0g+4ziuyjgyl40zqbmkwcqz17oskr4mrlzydp5kf004vlao0zbco3gztopp6ekgzejwtxpd1t2eakxe1k+gyiffqalmtmglcihd1fkastk0hauyqfavzubuckywnrxfd+anialawfw2qcy5rnypur1ggmweds3mrzu1vmkzbvslpnoazf0caqfa2lauivovqpchlcuibzxllyamhklyeqirgpafb0ec0/7rd5wqwo2crymkyxe17hmcwb282zwheo0vrcsigekibrapcuqpitilt7ktmyylt6ts5g1hdovlngycokokmc4psbzwbliqgk5xg5e8hoqirulixojjnytqusivqkvcalaqc1pjgk6wtsnq7tngq+lblgd/qoiqylcozmbtvhee/03tcgu+i9invfyzqjgzi7uaxjudd6qmq1s4ysgxkhwujrlnqpucyng1o0ats5bznsvy5igvkekiba9tkrhtyuwvsdudglxazuwndhlt4g4+vyuauzke7zsehpzz2h8zzhi2/0jwkv4kvxsoefg1liudarkukbfy5cgufiuxbby5cvyausmeo+/hktzcli3mpouarorqkhai5lc6eclly5ai5egjqxaick0av11cjefidzrsehigjxkbrrzehy7kmeq5htdyn/df5sgqtgkciujwktokuctq+q7ciwu8e9jo3spv3jkfftv0ukjujzqawhsekkxfaouddra+gc2+ygjlkwunzlupkaqguklksoesglljonbee9va0xncnnuv7z55wpkubzbafiwrzbe/wdcb851u1udqtuifdxwkfptqqe7laiamjmjdjn9kbca46bagow/mad4hrwhg7tqgqhwt3jh/wclpnwltfqfxxw09yga/pq3xvc4mcyq4kuugpuiv70qppqaxhrtulducugvdrcus0wuqfiqralrflqyg3a7wuuhvfhghztezl2h9d9kui4cqcoccbg6gwmd/jruhvslrpomh8d7+suqta95g9xto6clswvvgbib/ln9osn9qxdmfvicpvpha2kflrdikhtgnookjjghktuznbhppc0m8m47/qn2tyg2f5jfuwnkoqik4j3emoz1our5jujpaqrurdxlhvdre7tnh73klwjnarao9lhscrjycw/8lgllpwdow4hqvp/9lbdso8zr90nesggd3zr8fjw2qi5ktndzu9a7i8wefelwntmwk7h1kivadjoguleijhyavknb7wbjq0wve5o+ycvxgimwe0xiluuhumyqi98047da9oaduvefkapqmqlrs/6yaxcuwktd0eybosyjlhskzih2mfy5rlyimcw4zjg6ybrpmofpbhsqxisvmaadyeqiwhzsqfiojduddwgf0csdg0epnannrjb5nkpfjtsyzq2aa3psql/5ghataagzlhkyue+yspuc6hovi/lrtdzxgx8d/qpfoswlshcajwtzqqjk+bgx1udrqrc0umsstpivakteggrb2ayuhf0icrbht1psu0urxekofbmh5tfs1j7upvkorrcd87y/5foo2cvn5n5kmsber9prpkxsmbpaf+yyqrqwd5eu7urmyduqw13hdi2mtqud9pfxj1jc0gdwa8bepzuj+ok2bvcc4532udribi1vo5e3uio4uxju5wahci0qncuycqdhpv5apnrixfo/an0y+syjzfh6zu4qgq1q6feu06dylqokpsuugqiihcuiiqwrkik5rx//2q==",
    job: "design leader",
  },
  {
    username: "nhi hoang",
    avatar:
      "https://images.unsplash.com/photo-1557296387-5358ad7997bb?ixid=mxwxmja3fdb8mhxzzwfyy2h8mxx8cg9ydhjhaxrzfgvufdb8fdb8&ixlib=rb-1.2.1&w=1000&q=80",
    role: "host",
    job: "designer trainee",
  },
  {
    username: "sam john",
    avatar:
      "https://i.pinimg.com/originals/1a/42/fc/1a42fc32af714ef0fd005286e95c6984.jpg",
    job: "content writter",
  },
  {
    username: "john due",
    avatar:
      "https://i.pinimg.com/originals/71/8a/06/718a06d0e3936de9402b6421dd3a28a7.jpg",
    job: "ceo",
  },

  {
    username: "alice jackson",
    avatar:
      "https://image.freepik.com/free-photo/half-profile-image-beautiful-young-woman-with-bob-hairdo-posing-gazing-with-eyes-full-reproach-suspicion-human-facial-expressions-emotions-reaction-feelings_343059-4660.jpg",
    job: "web developer",
  },
];

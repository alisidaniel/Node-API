export const mailHTML = (url: string, type: string, title: string) => {
    return `
    <div>
    <style type= text/css >
      div {
        padding: 2rem;
        display: flex;
        flex-direction:column;
        background:#19202A;
        color: white;
      }
      h1:{
        font-size:2.5rem;
      }
      p{
        font-size: 1rem;
      }
      a{
        height: 40px;
        width: 140px;
        display:flex;
        align-items:center;
        justify-content:center;
        background: none;
        padding:0.5rem 1rem;
        font-size: 1rem;
        color:white;
        border: 3px #00A69C solid;
        border-radius: 7px;
        text-decoration: none;
        transition: all .2s ease-in-out;
      }
      a:hover{
        transform: scale(1.2);
        background: #00A69C;
        color:#19202A
      }
      a:active{
        transform: scale(0.9);
      }
    </style>
    <h1>${title}</h1>
    <p>Kindly click the button below to procceed</p>
    <a href="${url}">${type}</a>
    </div>
    `;
};
